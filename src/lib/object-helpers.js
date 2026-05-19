export function traverseObject (source, path = []) {
  for (const propertyKey in source) {
    const value = source[propertyKey]
    console.log(`${path} ${propertyKey}`, value)

    if (typeof value === 'object' && value !== null) {
      traverseObject(value, [...path, propertyKey])
    }
  }
}

export function getPathsToTargetObjectInSourceObject (sourceObject, targetObject, path = [], objectPaths = []) {
  for (const propertyKey in sourceObject) {
    const value = sourceObject[propertyKey];

    if(value === targetObject) {
      objectPaths.push([...path, propertyKey]);
    }

    if (typeof value === 'object' && value !== null) {
      getPathsToTargetObjectInSourceObject(value, targetObject,[...path, propertyKey], objectPaths)
    }
  }
  return objectPaths;
}

export function isTargetObjectChildOfSourceObject(source, target) {
  return getPathsToTargetObjectInSourceObject(source, target).length > 0;
}