import { WatchHandler, WatchOptions } from 'vue';
import { ensureCurrentVM, isMounting } from '../helper';

/**
 * watch datas
 * @param getter
 * @param cb
 * @param options
 */
export function useWatch<T>(getter: () => T, cb: WatchHandler<T>, options?: WatchOptions): void {
  const vm = ensureCurrentVM('useWatch');
  if (isMounting()) {
    vm.$watch(getter, cb, options);
  }
}
