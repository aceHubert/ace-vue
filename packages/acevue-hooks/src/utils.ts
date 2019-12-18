import Vue from 'vue';

export const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export const noop: any = (_: any) => _;

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target: any, key: string, { get, set }: { get?: Function; set?: Function }) {
  sharedPropertyDefinition.get = get || noop;
  sharedPropertyDefinition.set = set || noop;
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: Object | any[], key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

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

export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

export function isArray<T>(x: unknown): x is T[] {
  return Array.isArray(x);
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}

const toString = (x: any) => Object.prototype.toString.call(x);
export function isPlainObject(x: unknown): x is Record<any, any> {
  return toString(x) === '[object Object]';
}

export function isFunction(x: unknown): x is Function {
  return typeof x === 'function';
}

export function createUid() {
  return Math.random()
    .toString(36)
    .substring(3, 8);
}

export function assert(condition: any, msg: string) {
  if (!condition) throw new Error(`[@acevue/hooks] ${msg}`);
}

export function warn(condition: boolean, msg: string, vm?: Vue) {
  if (!condition) {
    // todo: need console.error for test
    console.error(`[@acevue/hooks] ${msg}`, vm);
  }
}
