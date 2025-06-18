function mergeIntoArray(a, b) {
  // Merge no matter whether a, or b, or neither, or both are arrays already.
  return [a, b].flat();
}

function deepMerge(
  a,
  b,
  // This is called when there is one or more non-object values that match the same key.
  conflictHandler = (a, b) => (a === b ? a : mergeIntoArray(a, b)),
) {
  // Arrays are objects, so need to deal with separately and before the next base case.
  if (Array.isArray(a) || Array.isArray(b)) {
    return mergeIntoArray(a, b);
  }

  // If either a or b is not an object or array.
  if (typeof a !== 'object' || typeof b !== 'object') {
    if (typeof a !== 'undefined' && typeof b !== 'undefined') {
      // At this point, a and b are guaranteed to not be arrays, or undefined, but one could be an object.
      // Use handler to decide whether to keep both values, or discard one.
      // Default handler puts both in an array if they are different, or keeps one value if they are the same.
      return conflictHandler(a, b);
    }
    if (typeof a === 'undefined') return b;
    else return a;
  }

  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const merged = {};
  for (const key of allKeys) {
    const av = a[key];
    const bv = b[key];
    merged[key] = deepMerge(av, bv, conflictHandler);
  }
  return merged;
}

module.exports = deepMerge;
