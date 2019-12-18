/*
 * React hooks DefinitelyTyped
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e1f9647734bd990f49b0aca0f44acd4d55fe1e93/types/react/index.d.ts#L970
 */

import { proxy } from '../utils';

// Unlike the class component setState, the updates are not allowed to be partial
export type SetStateAction<S> = S | ((prevState: S) => S);

// this technically does accept a second argument, but it's already under a deprecation warning
// and it's not even released so probably better to not define it.
export type Dispatch<A> = (value: A) => void;

export type DependencyList = ReadonlyArray<unknown>;

// NOTE: callbacks are _only_ allowed to return either void, or a destructor.
// The destructor is itself only allowed to return void.
export type EffectCallback = () => void | (() => void | undefined);

// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
export type PrimitiveType = string | number | bigint | boolean | null | undefined | symbol;

export interface RefOption<T> {
  get(): T;
  set?(x: T): void;
}

export interface RefObject<T> {
  readonly current: T | null;
}
export type Ref<T> =
  | { bivarianceHack(instance: T | null): void }['bivarianceHack']
  | RefObject<T>
  | null;

export interface MutableRefObject<T> {
  current: T;
}

export interface CallableRefObject<T> {
  (): void;
  current: T | null;
}

export class RefImpl<T> implements RefObject<T> {
  public current!: T;
  constructor({ get, set }: RefOption<T>) {
    proxy(this, 'current', {
      get,
      set,
    });
  }
}

export function isRef<T>(value: any): value is Ref<T> {
  return value instanceof RefImpl;
}

export interface InjectionKey<T> extends Symbol {}
