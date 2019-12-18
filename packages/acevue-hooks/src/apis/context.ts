import Vue from 'vue';
import { createUid, objectIs, warn } from '../utils';
import { withHooks, Data, VueProxy, ComponentPropsOptionsWithRecordProps } from '../component';
import { useInject, useProvide } from './inject';
import { useData } from './state';
import { useWatch } from './watch';
import { useMounted, useUpdated, useDestroyed } from './lifecycle';

const MAX_SIGNED_31_BIT_INT: number = 1073741823;

interface Emmiter<T> {
  on(handler: (value: T, changedBits: number) => void): void;
  off(handler: (value: unknown, changedBits: number) => void): void;
  get(): T;
  set(value: T, changedBits: number): void;
}

interface VueContext<PropsOptions = ComponentPropsOptionsWithRecordProps> {
  Provider: VueProxy<PropsOptions, Data>;
  Consumer: VueProxy<PropsOptions, Data>;
  [key: string]: any;
}

function createEventEmitter<T = unknown>(value: T): Emmiter<T> {
  const listeners: Array<(value: unknown, changedBits: number) => void> = [];
  return {
    on(handler) {
      listeners.push(handler);
    },
    off(handler) {
      listeners.splice(listeners.findIndex(handler), 1);
    },
    get() {
      return value;
    },
    set(value, changedBits) {
      listeners.forEach(handler => handler(value, changedBits));
    },
  };
}

function onlyChild(children: unknown) {
  return Array.isArray(children) ? children[0] : children;
}

export function createContext<T>(
  defaultValue: T,
  //使用Object.is()计算新老context的差异
  calculateChangedBits?: ((a: T, b: T) => number) | null,
): VueContext {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(
        calculateChangedBits === null || typeof calculateChangedBits === 'function',
        `createContext: Expected the optional second argument to be a ` +
          `function. Instead received: ${typeof calculateChangedBits}`,
      );
    }
  }

  const contextPropName = `__CONTEXT_PROP_${createUid()}__`;

  const Provider = withHooks(
    {
      value: null,
      default: () => defaultValue,
    },
    (h, props, { slots }) => {
      const data = useData({
        __PROVIDEVAUE__: props.value, // The key start with '_' will not render under this
      });
      const emitter = createEventEmitter(data.__PROVIDEVAUE__);
      useProvide(contextPropName, emitter);

      useWatch(
        () => props.value,
        (newValue, oldValue) => {
          let changedBits: number;
          if (objectIs(oldValue, newValue)) {
            changedBits = 0;
          } else {
            changedBits =
              typeof calculateChangedBits === 'function'
                ? calculateChangedBits(oldValue, newValue)
                : MAX_SIGNED_31_BIT_INT;
            if (process.env.NODE_ENV !== 'production') {
              warn(
                (changedBits & MAX_SIGNED_31_BIT_INT) === changedBits,
                `createContext:calculateChangedBits Expected the return value to be a ` +
                  `31-bit integer. Instead received: ${changedBits}`,
              );
            }
          }
          changedBits |= 0;
          if (changedBits !== 0) {
            console.log('provider value updated');
            emitter.set(props.value, changedBits);
          }
        },
      );

      useMounted(() => {
        console.log('provider mounted');
      });

      useUpdated(() => {
        console.log('provider updated');
      });

      const children = slots['default'];
      warn(
        !children || (children && children.length <= 1),
        'createContext: Context.Provider must have a single root element',
      );

      return onlyChild(children);
    },
  );

  const Consumer = withHooks(
    {
      observedBits: { type: Number, required: true, default: 1 },
    },
    (h, props, { scopedSlots }) => {
      const emitter = useInject<Emmiter<unknown>>(contextPropName);

      // todo useData will updated once
      const data = useData({
        value: emitter && emitter.get(),
        observedBits: 0,
      });

      const onUpdate = (value: unknown, changedBits: number) => {
        const observedBits = data.observedBits | 0;
        if ((observedBits & changedBits) !== 0) {
          data.value = value;
          console.log('consumer update value', data.value);
        }
      };

      useMounted(() => {
        emitter && emitter.on(onUpdate);
        // console.log('consumer mounted')
        const { observedBits } = props;
        data.observedBits =
          observedBits === undefined || observedBits === null
            ? MAX_SIGNED_31_BIT_INT
            : observedBits;

        console.log('consumer mounted');
      });

      useUpdated(() => {
        console.log('consumer updated');
      });

      useDestroyed(() => {
        emitter && emitter.off(onUpdate);
        console.log('consumer destoryed');
      });

      const children = scopedSlots.default && scopedSlots.default(data.value);
      if (process.env.NODE_ENV !== 'production') {
        warn(
          !children || (children && children.length <= 1),
          'createContext: Context.Consumer must have a single root element',
        );
      }
      return onlyChild(children);
    },
  );

  return {
    defaultValue,
    contextPropName,
    Provider,
    Consumer,
    _currentValue: defaultValue,
    _calculateChangedBits: calculateChangedBits,
  };
}

//Vue.observable works in 2.6+
function observable(data: any) {
  if (Vue.observable) {
    return Vue.observable(data);
  }
  return new Vue({
    data() {
      return data;
    },
  }).$data;
}

export function useContext(context: any, observedBits?: number | null) {
  const { defaultValue, contextPropName } = context;

  const emitter = useInject<Emmiter<unknown>>(contextPropName);
  const data = observable({ value: (emitter && emitter.get()) || defaultValue });

  const onUpdate = (value: unknown, changedBits: number) => {
    const _observedBits =
      (observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits) |
      0;
    if ((_observedBits & changedBits) !== 0) {
      data.value = value;
      console.log('useContext update value', value);
    }
  };

  useMounted(() => {
    console.log('useContext mounted');
    emitter && emitter.on(onUpdate);
  });

  useUpdated(() => {
    console.log('useContext updated');
  });

  useDestroyed(() => {
    console.log('useContext destory');
    emitter && emitter.off(onUpdate);
  });

  return data.value;
}
