import { isPrimitive } from '@acevue/utils/type';
import { ensureCurrentVM, getCallId, isMounting } from '../helper';
import { Dispatch, SetStateAction, MutableRefObject, PrimitiveType } from '../types/apis';
import { createRef, isRef } from './ref';
import { observe } from './reactivty';

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
  const id = getCallId();

  const state = (vm._stateStore = vm._stateStore || observe({}));
  const updater = (newValue: any): void => {
    if (isRef(state[id])) {
      state[id].current = newValue;
    } else {
      state[id] = newValue;
    }
  };
  if (isMounting()) {
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
  const id = getCallId();

  const state = (vm._stateStore = vm._stateStore || observe({}));
  if (isMounting()) {
    vm.$set(state, id, initialData);
  }

  return isPrimitive(state[id])
    ? createRef({ get: () => state[id], set: val => (state[id] = val) })
    : state[id];
}
