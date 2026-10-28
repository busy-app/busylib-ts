import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { expect, test } from 'vitest';

const dist = path.resolve(__dirname, '../../dist');

// Runtime names come from importing the bundle, type names from the rolled-up declarations: both are what consumers get from npm.
async function runtimeExports() {
  // The path is computed so typecheck does not depend on dist existing.
  const module = await import(pathToFileURL(path.join(dist, 'index.js')).href);
  return Object.keys(module).sort();
}

// The cjs build is emitted separately, so it can lose or rename exports the es build has.
function requireExports() {
  return Object.keys(createRequire(import.meta.url)(path.join(dist, 'index.cjs'))).sort();
}

function declarationExports() {
  const file = path.join(dist, 'index.d.ts');
  const program = ts.createProgram([file], { skipLibCheck: true, noEmit: true });
  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(file)!)!;
  const values: string[] = [];
  const types: string[] = [];
  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    (target.flags & ts.SymbolFlags.Value ? values : types).push(symbol.name);
  }
  return { values: values.sort(), types: types.sort() };
}

test('public exports match the snapshot', async () => {
  const exports = { js: await runtimeExports(), dts: declarationExports() };
  expect(exports.dts.values).toEqual(exports.js);
  expect(requireExports()).toEqual(exports.js);
  await expect(JSON.stringify(exports, null, 2) + '\n').toMatchFileSnapshot('__snapshots__/exports.json');
});
