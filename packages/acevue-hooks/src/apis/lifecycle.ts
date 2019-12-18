import { ensureCurrentVM, status } from '../helper';
import { EffectCallback, DependencyList, CallableRefObject } from '../types/apis';
import { objectIs } from '../utils';
import { useRef } from './ref';

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * @param rawEffect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 */
export function useEffect(rawEffect: EffectCallback, deps?: DependencyList) {
  const vm = ensureCurrentVM('useEffect');
  const id = ++status.callIndex;

  const store = (vm._effectStore = vm._effectStore || Object.create(null));
  if (status.isMounting) {
    const cleanup: CallableRefObject<ReturnType<EffectCallback>> = Object.assign(
      function() {
        const { current } = cleanup;
        if (current) {
          current();
          cleanup.current = null;
        }
      },
      {
        current: null,
      },
    );
    let effect: CallableRefObject<EffectCallback> = Object.assign(
      function(this: any) {
        const { current } = effect;
        if (current) {
          cleanup.current = current.call(this);
          effect.current = null;
        }
      },
      {
        current: rawEffect,
      },
    );

    store[id] = {
      effect,
      cleanup,
      deps,
    };

    vm.$on('hook:mounted', effect);
    vm.$on('hook:destroyed', cleanup);
    if (!deps || deps.length > 0) {
      vm.$on('hook:updated', effect);
    }
  } else {
    const record = store[id];
    const { effect, cleanup, deps: prevDeps = [] } = record;
    record.deps = deps;
    if (!deps || deps.some((d, i) => !objectIs(d, prevDeps[i]))) {
      cleanup();
      effect.current = rawEffect;
    }
  }
}

/**
 * lifecycle mounted
 * @param effect Imperative function
 */
export function useMounted(effect: () => void) {
  useEffect(effect, []);
}

/**
 *
 * @param effect Imperative function
 * @param deps If present, effect will only activate if the values in the list change.
 */
export function useUpdated(effect: () => void, deps?: DependencyList) {
  const isMount = useRef(true);
  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
    } else {
      return effect();
    }
  }, deps);
}

export function useDestroyed(effect: () => void) {
  useEffect(() => effect, []);
}
