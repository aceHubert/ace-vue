/**
 * https://github.com/yyx990803/vue-hooks
 * useHooks mixin
 */
import { VueConstructor } from 'vue';
import {
  Data,
  UseHooksFunction,
  ComponentInstance,
  createUseHooksContext,
  activateCurrentInstance,
} from './component';
import { warn, assert, isPlainObject } from './utils';
import { resetCallId } from './helper';

export function mixin(Vue: VueConstructor): void {
  Vue.mixin({
    beforeCreate(this: ComponentInstance) {
      const vm = this;
      const $options = vm.$options;

      const { useHooks } = $options;

      if (!useHooks) {
        return;
      }

      if (typeof useHooks !== 'function') {
        warn(
          process.env.NODE_ENV === 'production',
          'The "setup" option should be a function in component definitions.',
          vm,
        );
        return;
      }

      vm._effectStore = {};
      vm._refsStore = {};
      vm._computedStore = {};

      const { data } = $options;

      $options.data = function wrappedData() {
        useHooksInit(vm, vm.$props);
        const ret =
          (data && typeof data === 'function'
            ? (data as (this: ComponentInstance, x: ComponentInstance) => object).call(vm, vm)
            : data) || {};
        ret._state = {};
        return ret;
      };
    },
  });
}

function useHooksInit(vm: ComponentInstance, props: Record<any, any> = {}): void {
  const useHooks = vm.$options.useHooks!;
  const render = vm.$options.render;
  const cxt = createUseHooksContext(vm);

  // resolve scopedSlots and slots to functions
  // resolveScopedSlots(vm, cxt.slots)

  let binding: ReturnType<UseHooksFunction<Data, Data>> | undefined | null;
  // activateCurrentInstance(vm, () => {
  //   binding = useHooks(props, cxt)
  // })

  // if (isFunction(binding)) {
  //   const bindingFunc = binding
  //   vm.$options.render = () => {
  //     // reset callIndex
  //     status.callIndex = 0
  //     status.isMounting = !vm._vnode
  //     resolveScopedSlots(vm, cxt.slots)
  //     return activateCurrentInstance(vm, () => bindingFunc())
  //   }
  //   return
  // }

  // @ts-ignore
  vm.$options.render = (...args: any[]) => {
    return activateCurrentInstance(vm, () => {
      // reset callIndex
      resetCallId();
      binding = useHooks(props, cxt);

      // todo: test
      // if (isFunction(binding)) {
      //   const buindingFunc = binding
      //   resolveScopedSlots(vm, cxt.slots)
      //   return buindingFunc.apply(vm, args)
      // }

      if (isPlainObject(binding)) {
        if (process.env.NODE_ENV !== 'production') {
          assert(!!render, `render is missing in "useHooks" return a "Object"`);
        }
        Object.assign(vm._self, binding);
        return render!.apply(vm, args);
      }

      if (process.env.NODE_ENV !== 'production') {
        assert(
          false,
          `"useHooks" must return a "Object" or a "Function", got "${Object.prototype.toString
            .call(binding)
            .slice(8, -1)}"`,
        );
      }
    });
  };
}
