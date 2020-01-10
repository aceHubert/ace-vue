import { VNode } from 'vue';
import { objectIs } from '@acevue/utils/type';
import { createUid, warn } from '../utils';
import { withHooks } from '../component';
import { useInject, useProvide } from './inject';
import { useData } from './state';
import { useWatch } from './watch';
import { useMounted, useDestroyed } from './lifecycle';
import { Emmiter, Context } from '../types/apis';

const MAX_SIGNED_31_BIT_INT = 1073741823;

function createEventEmitter<T = unknown>(value: T): Emmiter<T> {
  const listeners: Array<(value: unknown, changedBits: number) => void> = [];
  return {
    on(handler): void {
      listeners.push(handler);
    },
    off(handler): void {
      listeners.splice(listeners.findIndex(handler), 1);
    },
    get(): T {
      return value;
    },
    set(value, changedBits): void {
      listeners.forEach(handler => handler(value, changedBits));
    },
  };
}

function onlyChild(children: VNode[], compt: 'Provider' | 'Consumer'): VNode {
  if (process.env.NODE_ENV !== 'production') {
    warn(
      !children || (children && children.length <= 1),
      `createContext: Context.${compt} must have a single root element`,
    );
  }
  return Array.isArray(children) ? children[0] : children;
}

/**
 * createContext
 * @param defaultValue default value
 * @param calculateChangedBits calculate the defferent between new value and old value
 */
export function createContext<T>(
  defaultValue: T,
  //使用Object.is()计算新老context的差异
  calculateChangedBits?: ((prev: T, next: T) => number) | null,
): Context<T> {
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
      value: { type: null, default: () => defaultValue },
    },
    (h, props, { slots }) => {
      const data = useData({
        __PROVIDEVALUE__: props.value as T, // The key start with '_' will not render under this
      });
      const emitter = createEventEmitter(data.__PROVIDEVALUE__);

      useProvide(contextPropName, emitter);
      useWatch(
        () => props.value,
        (newValue: T, oldValue: T) => {
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
            emitter.set(props.value, changedBits);
          }
        },
      );

      const children = slots['default'];
      return onlyChild(children, 'Provider');
    },
  );

  const Consumer = withHooks(
    {
      observedBits: { type: Number, default: 1 },
    },
    (h, props, { scopedSlots }) => {
      const emitter = useInject<Emmiter<unknown>>(contextPropName);
      const data = useData({
        value: emitter ? emitter.get() : null,
        observedBits: 0,
      });

      const onUpdate = (value: unknown, changedBits: number): void => {
        const observedBits = data.observedBits | 0;
        if ((observedBits & changedBits) !== 0) {
          data.value = value;
        }
      };

      useMounted(() => {
        emitter && emitter.on(onUpdate);
        const { observedBits } = props;
        data.observedBits =
          typeof observedBits === 'undefined' || observedBits === null
            ? MAX_SIGNED_31_BIT_INT
            : observedBits;
      });

      useDestroyed(() => {
        emitter && emitter.off(onUpdate);
      });

      const children = scopedSlots.default && scopedSlots.default(data.value);
      return onlyChild(children, 'Consumer');
    },
  );

  return {
    Provider,
    Consumer,
    _contextPropName: contextPropName,
    _currentValue: defaultValue,
    _calculateChangedBits: calculateChangedBits,
  };
}

/**
 * useContext
 * @param context from createContext
 * @param observedBits
 */
export function useContext<T>(context: Context<T>, observedBits?: number | null): T {
  const { _contextPropName } = context;

  const emitter = useInject<Emmiter<unknown>>(_contextPropName);
  const data = useData({
    value: emitter ? emitter.get() : null,
    observedBits: 0,
  });

  const onUpdate = (value: unknown, changedBits: number): void => {
    const observedBits = data.observedBits | 0;
    if ((observedBits & changedBits) !== 0) {
      data.value = value;
    }
  };

  useMounted(() => {
    emitter && emitter.on(onUpdate);
    data.observedBits =
      typeof observedBits === 'undefined' || observedBits === null
        ? MAX_SIGNED_31_BIT_INT
        : observedBits;
  });

  useDestroyed(() => {
    emitter && emitter.off(onUpdate);
  });

  return data.value as T;
}
