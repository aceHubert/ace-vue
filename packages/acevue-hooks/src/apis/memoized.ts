import { objectIs } from '@acevue/utils/type';
import { ensureCurrentVM, getCallId, isMounting } from '../helper';
import { DependencyList } from '../types/apis';
import { useRef } from './ref';

function memoizedHelper<T>(factory: () => T): (deps: DependencyList | undefined) => T {
  const isMounting = useRef(true);
  const record: {
    deps: DependencyList | undefined;
    value: T;
  } = {
    deps: undefined,
    value: factory(), // initital value
  };

  return (deps: DependencyList | undefined) => {
    const { deps: prevDeps = [] } = record;

    if (isMounting.current) {
      isMounting.current = false;
      record.deps = deps;
    } else if (deps && deps.some((value, index) => !objectIs(value, prevDeps[index]))) {
      record.deps = deps;
      record.value = factory();
    }

    return record.value;
  };
}

// allow undefined, but don't make it optional as that is very likely a mistake
export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T {
  const vm = ensureCurrentVM('useMemo');
  const id = getCallId();

  if (isMounting()) {
    if (!vm._memoStore) {
      vm._memoStore = {};
    }
    vm._memoStore[id] = memoizedHelper<T>(factory);
  }

  return vm._memoStore[id](deps);
}

// function useCallback<T extends (...args: never[]) => unknown> (callback: T, deps: DependencyList): T {
//   const vm = ensureCurrentVM('useCallback')

// }
