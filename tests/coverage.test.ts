// Endpoint coverage: the new scopes call exactly the endpoints the old api modules called, and together they cover every endpoint of the API schema.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const root = path.resolve(__dirname, '..');
const oldApiDir = path.join(root, 'src/BusyBar-old/api');
const scopesDir = path.join(root, 'src/BusyBar/scopes');

// Endpoints served elsewhere, not by request functions.
const NOT_WRAPPED = ['GET /status/ws'];

// `client.GET('/path'` and the like, also when prettier moves the path to the next line.
function endpointsIn(file: string): string[] {
  const source = fs.readFileSync(file, 'utf8');
  return [...source.matchAll(/\.(GET|POST|PUT|DELETE)\(\s*'([^']+)'/g)].map(([, method, endpoint]) => `${method} ${endpoint}`).sort();
}

// Methods declared with an operation in `paths` of the generated schema; methods typed `?: never` are absent.
function schemaEndpoints(): string[] {
  const source = fs.readFileSync(path.join(root, 'src/Global/API.ts'), 'utf8');
  const paths = source.slice(source.indexOf('export interface paths {'), source.indexOf('\n}\n', source.indexOf('export interface paths {')));
  const endpoints: string[] = [];
  let current = '';

  for (const line of paths.split('\n')) {
    const pathMatch = line.match(/^ {2}'([^']+)': \{$/);
    if (pathMatch) {
      current = pathMatch[1]!;
      continue;
    }
    const methodMatch = line.match(/^ {4}(get|put|post|delete|patch|head|options|trace): /);
    if (methodMatch) {
      endpoints.push(`${methodMatch[1]!.toUpperCase()} ${current}`);
    }
  }

  return endpoints.sort();
}

const oldScopes = fs
  .readdirSync(oldApiDir)
  .filter((name) => name !== 'createClient.ts')
  .map((name) => path.basename(name, '.ts'))
  .sort();

const migratedScopes = fs.existsSync(scopesDir) ? fs.readdirSync(scopesDir).sort() : [];

const oldEndpoints = (scope: string) => endpointsIn(path.join(oldApiDir, `${scope}.ts`));
const newEndpoints = (scope: string) => endpointsIn(path.join(scopesDir, scope, 'functions.ts'));

describe('endpoint coverage', () => {
  test('the old implementation covers the whole schema', () => {
    const covered = oldScopes.flatMap(oldEndpoints);
    expect(new Set(covered).size).toBe(covered.length);
    expect(covered).toHaveLength(78);
    expect(schemaEndpoints().filter((e) => !covered.includes(e))).toEqual(NOT_WRAPPED);
    expect(covered.filter((e) => !schemaEndpoints().includes(e))).toEqual([]);
  });

  test('migrated scopes call the same endpoints as before', () => {
    expect(migratedScopes.filter((scope) => !oldScopes.includes(scope))).toEqual([]);
    expect(Object.fromEntries(migratedScopes.map((scope) => [scope, newEndpoints(scope)]))).toEqual(
      Object.fromEntries(migratedScopes.map((scope) => [scope, oldEndpoints(scope)]))
    );
  });

  test.runIf(migratedScopes.length === oldScopes.length)('the new implementation covers the whole schema', () => {
    const covered = migratedScopes.flatMap(newEndpoints).sort();
    expect(covered).toEqual(schemaEndpoints().filter((e) => !NOT_WRAPPED.includes(e)));
  });
});
