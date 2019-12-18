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

export const status = {
  callIndex: 0,
  isMounting: false,
};
