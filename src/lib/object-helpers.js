export function getPathsToTargetObject (sourceObject, targetObject, path = [], objectPaths = []) {
  for (const propertyKey in sourceObject) {
    const value = sourceObject[propertyKey]

    if (value === targetObject) {
      objectPaths.push([...path, propertyKey])
    }

    if (typeof value === 'object' && value !== null) {
      getPathsToTargetObject(value, targetObject, [...path, propertyKey], objectPaths)
    }
  }
  return objectPaths
}

export function deepFreeze (object) {
  // Retrieve the property names defined on object
  const propNames = Reflect.ownKeys(object)

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = object[name]

    if ((value && typeof value === 'object') || typeof value === 'function') {
      deepFreeze(value)
    }
  }

  return Object.freeze(object)
}
