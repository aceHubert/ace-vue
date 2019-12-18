import { WatchHandler, WatchOptions } from 'vue';
import { ensureCurrentVM, status } from '../helper';

/**
 * watch datas
 * @param getter
 * @param cb
 * @param options
 */
export function useWatch<T>(getter: () => T, cb: WatchHandler<T>, options?: WatchOptions): void {
  const vm = ensureCurrentVM('useWatch');
  if (status.isMounting) {
    vm.$watch(getter, cb, options);
  }
}
