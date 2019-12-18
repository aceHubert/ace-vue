import { ensureCurrentVM, status } from '../helper';
import { MutableRefObject, RefObject, RefOption, RefImpl } from '../types/apis';

/**
 * createRef
 * @param options get/set
 */
export function createRef<T>(options: RefOption<T>): RefObject<T> {
  // seal the ref, this could prevent ref from being observed
  // It's safe to seal the ref, since we really shoulnd't extend it.
  return Object.seal(new RefImpl<T>(options));
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
export function useRef(initialValue?: any): any {
  const vm = ensureCurrentVM('useRef');
  const id = ++status.callIndex;

  const store = (vm._computedStore = vm._computedStore || Object.create(null));
  return status.isMounting ? (store[id] = { current: initialValue }) : store[id];
}
