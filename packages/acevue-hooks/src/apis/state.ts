import { ensureCurrentVM, status } from '../helper';
import { Dispatch, SetStateAction, MutableRefObject, PrimitiveType, isRef } from '../types/apis';
import { isPrimitive } from '../utils';
import { createRef } from './ref';

/**
 * Returns a stateful value, and a function to update it.
 */
export function useState<S = undefined>(): [
  (S extends PrimitiveType ? MutableRefObject<S> : S) | MutableRefObject<undefined>,
  Dispatch<SetStateAction<S | undefined>>,
];
/**
 * Returns a stateful value, and a function to update it.
 * @param initialState initial state
 */
export function useState<S>(
  initialState: S | (() => S),
): [S extends PrimitiveType ? MutableRefObject<S> : S, Dispatch<SetStateAction<S>>];
/**
 * implementation
 */
export function useState(initialState?: any): any {
  const vm = ensureCurrentVM('useState');
  const id = ++status.callIndex;
  const state = (vm.$data._state = vm.$data._state || {});
  const updater = (newValue: any) => {
    if (isRef(state[id])) {
      state[id].current = newValue;
    } else {
      state[id] = newValue;
    }
  };
  if (status.isMounting) {
    vm.$set(
      state,
      id,
      initialState
        ? typeof initialState === 'function'
          ? initialState()
          : initialState
        : undefined,
    );
  }
  return [
    isPrimitive(state[id])
      ? createRef({ get: () => state[id], set: val => (state[id] = val) })
      : state[id],
    updater,
  ];
}

/**
 * Returns a stateful value.
 * @param initialData initial data
 */
export function useData<T>(
  initialData: T | null,
): T extends PrimitiveType ? MutableRefObject<T> : T {
  const vm = ensureCurrentVM('useData');
  const id = ++status.callIndex;
  const state = (vm.$data._state = vm.$data._state || {});
  if (status.isMounting) {
    vm.$set(state, id, initialData);
  }

  return isPrimitive(state[id])
    ? createRef({ get: () => state[id], set: val => (state[id] = val) })
    : state[id];
}
