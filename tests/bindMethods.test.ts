import { describe, expect, test } from 'vitest';
import { bindMethods } from 'BusyBar/bindMethods';

class Base {
  private readonly name = 'base';

  constructor() {
    bindMethods(this, Base.prototype);
  }

  get label(): string {
    return `label:${this.name}`;
  }

  hello(suffix = '') {
    return `hello ${this.name}${suffix}`;
  }
}

class Derived extends Base {
  override hello(suffix = '') {
    return `${super.hello(suffix)} from derived`;
  }

  extra() {
    return this.label;
  }
}

describe('bindMethods', () => {
  test('destructured methods keep this', () => {
    const { hello } = new Base();
    expect(hello('!')).toBe('hello base!');
  });

  test('methods passed as callbacks keep this', () => {
    expect(['?'].map(new Base().hello)).toEqual(['hello base?']);
  });

  test('subclass overrides with super are bound', () => {
    const { hello } = new Derived();
    expect(hello()).toBe('hello base from derived');
  });

  test('bound copies are not enumerable', () => {
    const instance = new Base();
    expect(Object.keys(instance)).toEqual(['name']);
    expect(Object.getOwnPropertyDescriptor(instance, 'hello')?.enumerable).toBe(false);
  });

  test('getters stay getters', () => {
    const instance = new Base();
    expect(Object.getOwnPropertyDescriptor(instance, 'label')).toBeUndefined();
    expect(instance.label).toBe('label:base');
  });

  test('methods outside the given prototype are not bound', () => {
    expect(Object.getOwnPropertyDescriptor(new Derived(), 'extra')).toBeUndefined();
  });
});
