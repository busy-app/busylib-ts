// The request code (`BusyBar/**`) runs on the device in JerryScript, which loses `this` inside async arrow functions: checked on the built code, since the bundler may rewrite the source.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { expect, test } from 'vitest';

const dir = path.resolve(__dirname, '../../dist/BusyBar');

// `this` used by the arrow itself, not by a nested function or class with its own `this`.
function usesThis(node: ts.Node): boolean {
  let found = false;
  const walk = (child: ts.Node) => {
    if (found || (ts.isFunctionLike(child) && !ts.isArrowFunction(child)) || ts.isClassLike(child)) return;
    if (child.kind === ts.SyntaxKind.ThisKeyword) {
      found = true;
      return;
    }
    ts.forEachChild(child, walk);
  };
  ts.forEachChild(node, walk);
  return found;
}

function asyncArrowsWithThis(file: string): string[] {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isArrowFunction(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) && usesThis(node)) {
      found.push(`${path.relative(dir, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

test('no async arrow function in the request code uses this', () => {
  const files = fs.readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((f) => /\.(js|cjs)$/.test(f));
  expect(files.length).toBeGreaterThan(0);
  expect(files.flatMap((f) => asyncArrowsWithThis(path.join(dir, f)))).toEqual([]);
});
