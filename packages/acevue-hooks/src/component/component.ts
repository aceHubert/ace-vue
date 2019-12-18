import Vue, {
  VueConstructor,
  VNode,
  ComponentOptions as Vue2ComponentOptions,
  CreateElement,
} from 'vue';
import { getCurrentVM, setCurrentVM } from '../runtimeContext';
import { warn, proxy } from '../utils';
import { status } from '../helper';
import { HasDefined } from '../types/basic';
import {
  ComponentPropsOptionsWithRecordProps,
  ComponentPropsOptionsWithArrayProps,
  ExtractPropTypes,
} from './componentProp';

export type ComponentInstance = InstanceType<VueConstructor>;

export type Data = { [key: string]: unknown };

// public properties exposed on the proxy, which is used as the render context
// in templates (as `this` in the render option)
export type ComponentRenderProxy<P = {}, S = {}, PublicProps = P> = {
  $data: S;
  $props: PublicProps;
  $attrs: Data;
  $refs: Data;
  $slots: Data;
  $root: ComponentInstance | null;
  $parent: ComponentInstance | null;
  $emit: (event: string, ...args: unknown[]) => void;
} & P &
  S;

// for Vetur and TSX support
type VueConstructorProxy<PropsOptions, RawBindings> = {
  new (): ComponentRenderProxy<
    ExtractPropTypes<PropsOptions>,
    RawBindings,
    ExtractPropTypes<PropsOptions, false>
  >;
};

export type VueProxy<PropsOptions, RawBindings> = Vue2ComponentOptions<
  Vue,
  RawBindings,
  never,
  never,
  PropsOptions,
  ExtractPropTypes<PropsOptions, false>
> &
  VueConstructorProxy<PropsOptions, RawBindings>;

export interface UseHooksContext {
  readonly attrs: Record<string, string>;
  readonly slots: { [key: string]: VNode[] };
  readonly scopedSlots: { [key: string]: (...args: any[]) => VNode[] };
  readonly parent: ComponentInstance | null;
  readonly root: ComponentInstance;
  readonly listeners: { [key: string]: Function };

  emit(event: string, ...args: any[]): void;
}

export type UseHooksFunction<Props, RawBindings> = (
  this: void,
  props: Props,
  ctx: UseHooksContext,
) => RawBindings | (() => VNode | null);

interface ComponentOptionsWithRecordProps<
  PropsOptions = ComponentPropsOptionsWithRecordProps,
  RawBindings = Data,
  Props = ExtractPropTypes<PropsOptions>
> {
  props?: PropsOptions;
  useHooks?: UseHooksFunction<Props, RawBindings>;
}

interface ComponentOptionsWithoutProps<Props = never, RawBindings = Data> {
  props?: undefined;
  useHooks?: UseHooksFunction<Props, RawBindings>;
}

/**
 * createComponent
 * @param options
 */
// overload 1: object format with no props
export function createComponent<RawBindings>(
  options: ComponentOptionsWithoutProps<never, RawBindings>,
): VueProxy<never, RawBindings>;
// overload 2: object format with object props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function createComponent<
  Props,
  RawBindings = Data,
  PropsOptions extends ComponentPropsOptionsWithRecordProps = ComponentPropsOptionsWithRecordProps
>(
  // prettier-ignore
  options: (
    // prefer the provided Props, otherwise infer it from PropsOptions
    HasDefined<Props> extends true
    ? ComponentOptionsWithRecordProps<PropsOptions, RawBindings, Props>
    : ComponentOptionsWithRecordProps<PropsOptions, RawBindings>) &
    Omit<Vue2ComponentOptions<Vue>, keyof ComponentOptionsWithRecordProps<never, never>>,
): VueProxy<PropsOptions, RawBindings>;
// implementation, close to no-op
export function createComponent(options: any) {
  return options as any;
}

/**
 * withHooks
 * @param render
 */
// overload 1: object format with array props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function withHooks<
  PropNames extends string = never,
  PropsOptions = ComponentPropsOptionsWithArrayProps<PropNames>,
  RawBindings = Data,
  Props = ExtractPropTypes<PropsOptions>
>(
  props: PropNames[],
  render: (h: CreateElement, props: Props, cxt: UseHooksContext) => VNode,
): VueProxy<PropsOptions, RawBindings>;
// overload 2: object format with object props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function withHooks<
  PropsOptions = ComponentPropsOptionsWithRecordProps,
  RawBindings = Data,
  Props = ExtractPropTypes<PropsOptions>
>(
  props: PropsOptions,
  render: (h: CreateElement, props: Props, cxt: UseHooksContext) => VNode,
): VueProxy<PropsOptions, RawBindings>;
// overload 3: object format with no props
export function withHooks<RawBindings = Data>(
  render: (h: CreateElement, props: never, cxt: UseHooksContext) => VNode,
): VueProxy<never, RawBindings>;
// implementation, close to no-op
export function withHooks(propsOrRender: any, render?: any): any {
  let _props: {}, _render: (h: CreateElement, props: any, cxt: UseHooksContext) => VNode;
  if (typeof propsOrRender === 'function') {
    _props = {};
    _render = propsOrRender;
  } else {
    _props = propsOrRender;
    _render = render;
  }

  return {
    props: _props,
    data() {
      return {
        _state: {},
      };
    },
    render(this: ComponentInstance, h: CreateElement) {
      const vm = this;
      const cxt = createUseHooksContext(vm);
      status.callIndex = 0;
      return activateCurrentInstance(vm, () => {
        status.isMounting = !this._vnode;
        return _render(h, this.$props, cxt);
      });
    },
  };
}

export function activateCurrentInstance(
  vm: ComponentInstance,
  fn: (vm_: ComponentInstance) => any,
  onError?: (err: Error) => void,
) {
  const preVm = getCurrentVM();
  setCurrentVM(vm);
  try {
    return fn(vm);
  } catch (err) {
    if (onError) {
      onError(err);
    } else {
      throw err;
    }
  } finally {
    setCurrentVM(preVm);
  }
}

export function createUseHooksContext(
  vm: ComponentInstance & { [x: string]: any },
): UseHooksContext {
  const ctx = {
    slots: {},
  } as UseHooksContext;
  const props: Array<string | [string, string]> = [
    'root',
    'parent',
    'refs',
    'attrs',
    'slots',
    'scopedSlots',
    'listeners',
    'isServer',
    'ssrContext',
  ];
  const methodReturnVoid = ['emit'];
  props.forEach(key => {
    let targetKey: string;
    let srcKey: string;
    if (Array.isArray(key)) {
      [targetKey, srcKey] = key;
    } else {
      targetKey = srcKey = key;
    }
    srcKey = `$${srcKey}`;
    proxy(ctx, targetKey, {
      get: () => {
        return vm[srcKey];
      },
      set() {
        warn(
          process.env.NODE_ENV === 'production',
          `Cannot assign to '${targetKey}' because it is a read-only property`,
          vm,
        );
      },
    });
  });
  methodReturnVoid.forEach(key => {
    const srcKey = `$${key}`;
    proxy(ctx, key, {
      get() {
        return (...args: any[]) => {
          const fn: Function = vm[srcKey];
          fn.apply(vm, args);
        };
      },
    });
  });
  if (process.env.NODE_ENV === 'test') {
    (ctx as any)._vm = vm;
  }
  return ctx;
}

export function resolveScopedSlots(
  _vm: ComponentInstance,
  _slotsProxy: { [x: string]: Function },
): void {
  // todo
}
