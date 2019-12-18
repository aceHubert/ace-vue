import Vue, { VueConstructor, VNode } from 'vue';
import {
  VueProxy,
  ComponentPropsOptionsWithArrayProps,
  ComponentPropsOptionsWithRecordProps,
  ExtractPropTypes,
  Data,
  UseHooksFunction,
  UseHooksContext,
} from './component';
import {
  EffectCallback,
  DependencyList,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  RefObject,
  InjectionKey,
  PrimitiveType,
} from './types/apis';
import { Option as ComputedOption } from './apis/computed';

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    [key: string]: any;
  }
  interface VueConstructor {
    observable<T>(x: any): T; // < 2.6.0
    // data
    useData<T>(initialData: T | null): T extends PrimitiveType ? MutableRefObject<T> : T;

    useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
    useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];

    useComputed<T>(getter: ComputedOption<T>['get']): RefObject<Readonly<T>>;
    useComputed<T>(options: ComputedOption<T>): MutableRefObject<Readonly<T>>;

    useWatch(getter: () => any, cb: Vue.WatchHandler<any>, options?: Vue.WatchOptions): void;

    useProvide<T>(key: InjectionKey<T> | string, value: T): void;
    useInject<T>(key: InjectionKey<T> | string): T | void;
    useInject<T>(key: InjectionKey<T> | string, defaultValue: T): T | void;

    useRef<T extends unknown = undefined>(): MutableRefObject<T | undefined>;
    useRef<T extends unknown>(initialValue: T): MutableRefObject<T>;
    useRef<T>(initialValue: T | null): RefObject<T>;

    useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;

    // lifecycle
    useMounted(factory: () => void): void;
    useUpdated(factory: () => void, deps?: any[]): void;
    useDestroyed(factory: () => void): void;
    useEffect(factory: EffectCallback, deps?: DependencyList): void;

    // withHooks: object format with array props declaration
    withHooks<
      PropNames extends string = never,
      PropsOptions = ComponentPropsOptionsWithArrayProps<PropNames>,
      RawBindings = Data,
      Props = ExtractPropTypes<PropsOptions>
    >(
      props: PropNames[],
      render: (h: CreateElement, props: Props, cxt: UseHooksContext) => VNode,
    ): VueProxy<PropsOptions, RawBindings>;
    // withHooks: object format with object props declaration
    withHooks<
      PropsOptions = ComponentPropsOptionsWithRecordProps,
      RawBindings = Data,
      Props = ExtractPropTypes<PropsOptions>
    >(
      props: PropsOptions,
      render: (h: CreateElement, props: Props, cxt: UseHooksContext) => VNode,
    ): VueProxy<PropsOptions, RawBindings>;
    // withHooks: object format without props declaration
    withHooks<RawBindings = Data>(
      render: (h: CreateElement, props: never, cxt: UseHooksContext) => VNode,
    ): VueProxy<never, RawBindings>;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    useHooks?: UseHooksFunction<Data, Data>;
  }
}
