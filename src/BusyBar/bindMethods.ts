/**
 * Binds every method of the prototype to the instance as a non-enumerable own property, so methods keep `this` when destructured or passed as callbacks; overrides in subclasses are bound too, since the method is looked up on the instance.
 * @param {object} instance - The instance to bind methods to.
 * @param {object} prototype - The prototype whose methods are bound; getters and the constructor are skipped.
 */
export function bindMethods(instance: object, prototype: object) {
  const target = instance as Record<string, unknown>;

  for (const key of Object.getOwnPropertyNames(prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    if (key === 'constructor' || typeof descriptor?.value !== 'function') {
      continue;
    }

    const method = target[key] as (...args: unknown[]) => unknown;
    Object.defineProperty(instance, key, { value: method.bind(instance), enumerable: false, configurable: true, writable: true });
  }
}
