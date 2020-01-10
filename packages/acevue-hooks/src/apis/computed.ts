import { ensureCurrentVM, getCallId, isMounting } from '../helper';
import { MutableRefObject, RefObject } from '../types/apis';
import { warn } from '../utils';
import { createRef } from './ref';
import { observe } from './reactivty';

export interface Option<T> {
  get: () => T;
  set: (value: T) => void;
}

/**
 * overload 1: only getter computed
 * @param getter getter function
 */
export function useComputed<T>(getter: Option<T>['get']): RefObject<Readonly<T>>;
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
): RefObject<Readonly<T>> | MutableRefObject<Readonly<T>> {
  const vm = ensureCurrentVM('useComputed');
  const id = getCallId();
  let getter: Option<T>['get'], setter: Option<T>['set'] | undefined;
  if (typeof options === 'function') {
    getter = options;
  } else {
    getter = options.get;
    setter = options.set;
  }

  const store = (vm._computedStore = vm._computedStore || observe({}));
  if (isMounting()) {
    // @ts-ignore：sync 不在WatchOptions 中
    vm.$watch(
      getter,
      val => {
        vm.$set(store, id, val);
      },
      { sync: true, immediate: true },
    );
  }

  return createRef({
    get: () => store[id],
    set: val => {
      if (!setter) {
        warn(
          process.env.NODE_ENV === 'production',
          'Computed property was assigned to but it has no setter.',
          vm!,
        );
        return;
      }
      setter!(val);
    },
  });
}
