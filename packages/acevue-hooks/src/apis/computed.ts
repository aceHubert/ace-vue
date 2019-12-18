import { ensureCurrentVM, status } from '../helper';
import { MutableRefObject } from '../types/apis';
import { createRef } from './ref';
import { warn } from '../utils';

export interface Option<T> {
  get: () => T;
  set: (value: T) => void;
}

/**
 * overload 1: only getter computed
 * @param getter getter function
 */
export function useComputed<T>(getter: Option<T>['get']): Readonly<MutableRefObject<Readonly<T>>>;
/**
 * overload 2: getter/setter computed
 * @param getter getter function
 * @param setter setter function, if present, it will be returned a Object value
 */
export function useComputed<T>(options: Option<T>): MutableRefObject<Readonly<T>>;
/**
 * implementation
 */
export function useComputed<T>(
  options: Option<T>['get'] | Option<T>,
): Readonly<MutableRefObject<Readonly<T>>> | MutableRefObject<Readonly<T>> {
  const vm = ensureCurrentVM('useComputed');
  const id = ++status.callIndex;
  let getter: Option<T>['get'], setter: Option<T>['set'] | undefined;
  if (typeof options === 'function') {
    getter = options;
  } else {
    getter = options.get;
    setter = options.set;
  }

  const store = (vm._computedStore = vm._computedStore || Object.create(null));
  if (status.isMounting) {
    // @ts-ignore：sync 不在WatchOptions 中
    vm.$watch(
      getter,
      val => {
        store[id] = val;
      },
      { sync: true, immediate: true },
    );
  }

  return createRef({
    get: () => store[id],
    set: val => {
      if (process.env.NODE_ENV !== 'production' && !setter) {
        warn(false, 'Computed property was assigned to but it has no setter.', vm!);
        return;
      }
      setter!(val);
    },
  });
}
