import { getCurrentVM } from './runtimeContext';
import { ComponentInstance } from './component';
import { assert } from './utils';

export function ensureCurrentVM(hook: string): ComponentInstance {
  const vm = getCurrentVM();
  if (process.env.NODE_ENV !== 'production') {
    assert(vm, `"${hook}" get called outside of "useHooks()"`);
  }

  return vm!;
}

export function isMounting(): boolean {
  const vm = ensureCurrentVM('isMounting');
  return !vm._vnode;
}

let callIndex = 0;
export function getCallId(): number {
  return ++callIndex;
}

export function resetCallId(): number {
  callIndex !== 0 && (callIndex = 0);
  return callIndex;
}
