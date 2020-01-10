import { ensureCurrentVM, getCallId, isMounting } from '../helper';
import { MutableRefObject, RefObject, RefOption, Ref } from '../types/apis';
import { proxy } from '../utils';

class RefImpl<T> implements RefObject<T> {
  public current!: T;
  constructor({ get, set }: RefOption<T>) {
    proxy(this, 'current', {
      get,
      set,
    });
  }
}

/**
 * isRef
 * @param obj value
 */
export function isRef<T>(obj: any): obj is Ref<T> {
  return obj instanceof RefImpl;
}

/**
 * createRef
 * @param options get/set
 */
export function createRef<T>(options: RefOption<T>): RefObject<T> {
  const vm = ensureCurrentVM('createRef');
  const id = getCallId();

  const store = (vm._refsStore = vm._refsStore || {});
  // seal the ref, this could prevent ref from being observed
  // It's safe to seal the ref, since we really shoulnd't extend it.
  return isMounting() ? (store[id] = Object.seal(new RefImpl<T>(options))) : store[id];
}

/**
 * overload 1: for potentially undefined initialValue / call with 0 arguments
 */
export function useRef<T extends unknown = undefined>(): MutableRefObject<T | undefined>;
/**
 * overload 2: returns a mutable ref object whose `.current` property is initialized to the passed argument "initialValue"
 * @param initialValue initial value
 */
export function useRef<T extends unknown>(initialValue: T): MutableRefObject<T>;
/**
 * overload 3: for refs given as a ref prop as they typically start with a null value
 * @param initialValue initial value
 */
export function useRef<T>(initialValue: T | null): RefObject<T>;
/**
 * implementation
 */
export function useRef<T>(initialValue?: T): MutableRefObject<T> | RefObject<T> {
  const vm = ensureCurrentVM('useRef');
  const id = getCallId();

  const store = (vm._refsStore = vm._refsStore || {});
  if (isMounting()) {
    store[id] = initialValue;
  }
  return createRef({
    get: () => store[id],
    set: val => (store[id] = val),
  });
}
