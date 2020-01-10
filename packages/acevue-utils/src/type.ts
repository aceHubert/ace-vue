// Inlined Object.is polyfill.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
export function objectIs(x: any, y: any) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  // eslint-disable-next-line
  return x !== x && y !== y;
}

// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
export function isPrimitive(value: any): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'undefined' ||
    value === null
  );
}
