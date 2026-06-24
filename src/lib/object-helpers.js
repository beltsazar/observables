/**
 * Recursively freezes an object and all nested object values.
 *
 * @param {object} object - The object to deeply freeze.
 * @returns {object} The same object instance, fully frozen (including nested objects).
 *
 */
export function freezeDeep(object) {
  // Intended early-return for non-object values.
  if (object && typeof object !== "object") {
    return object;
  }

  // Retrieve all own keys (including symbols and non-enumerables).
  const propNames = Reflect.ownKeys(object);

  // Recursively freeze nested object properties first.
  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      freezeDeep(value);
    }
  }

  // Freeze and return the current object.
  return Object.freeze(object);
}
