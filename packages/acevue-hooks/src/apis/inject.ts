import { ComponentInstance } from '../component';
import { ensureCurrentVM, isMounting, getCallId } from '../helper';
import { hasOwn, warn } from '../utils';
import { InjectionKey } from '../types/apis';

const NOT_FOUND = {};

function resolveInject(provideKey: InjectionKey<any>, vm: ComponentInstance): any {
  let source = vm.$parent;
  while (source) {
    // @ts-ignore
    if (source._provided && hasOwn(source._provided, provideKey)) {
      //@ts-ignore
      return source._provided[provideKey];
    }
    source = source.$parent;
  }
  return NOT_FOUND;
}

export function useProvide<T>(key: InjectionKey<T> | string, value: T): void {
  const vm = ensureCurrentVM('useInject');
  if (isMounting()) {
    if (!vm._provided) {
      const provideCache = {};
      Object.defineProperty(vm, '_provided', {
        get: () => provideCache,
        set: v => Object.assign(provideCache, v),
      });
    }
    vm._provided[key as string] = value;
  }
}

export function useInject<T>(key: InjectionKey<T> | string): T | void;
export function useInject<T>(key: InjectionKey<T> | string, defaultValue: T): T | void;
export function useInject<T>(key: InjectionKey<T> | string, defaultValue?: T): T | void {
  if (!key) {
    return defaultValue;
  }

  const vm = ensureCurrentVM('useInject');
  const id = getCallId();

  const store = (vm._injectStore = vm._injectStore || {});
  if (isMounting()) {
    store[id] = resolveInject(key as InjectionKey<T>, vm);
  }

  if (store[id] !== NOT_FOUND) {
    return store[id];
  } else if (typeof defaultValue !== 'undefined') {
    return defaultValue;
  } else {
    warn(process.env.NODE_ENV === 'production', `Injection "${String(key)}" not found`, vm);
  }
}
