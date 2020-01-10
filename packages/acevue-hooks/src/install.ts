import { VueConstructor } from 'vue';
import { AnyObject } from './types/basic';
import { assert, isPlainObject, hasOwn, hasSymbol } from './utils';
import { setCurrentVue, currentVue } from './runtimeContext';
import { withHooks } from './component';
import {
  useData,
  useState,
  useComputed,
  useRef,
  useWatch,
  useProvide,
  useInject,
  useMemo,
  useMounted,
  useUpdated,
  useDestroyed,
  useEffect,
  createContext,
  useContext,
  isRef,
} from './apis';

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to: AnyObject, from?: AnyObject): Record<string, any> {
  if (!from) return to;
  let key: any;
  let toVal: any;
  let fromVal: any;

  const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') continue;
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      to[key] = fromVal;
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      !isRef(toVal) &&
      isPlainObject(fromVal) &&
      !isRef(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

// eslint-disable-next-line no-shadow
export function install(Vue: VueConstructor, _install: (Vue: VueConstructor) => void): void {
  if (currentVue && currentVue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, 'already installed. Vue.use(plugin) should be called only once');
    }
    return;
  }

  Vue.config.optionMergeStrategies.useHooks = function(parent: Function, child: Function) {
    return function mergedUseHooksFn(props: any, context: any) {
      return mergeData(
        typeof child === 'function' ? child(props, context) || {} : {},
        typeof parent === 'function' ? parent(props, context) || {} : {},
      );
    };
  };

  //set runtime vm
  setCurrentVue(Vue);

  // set alias
  Object.assign(Vue, {
    get useData() {
      return useData;
    },
    get useState() {
      return useState;
    },
    get useComputed() {
      return useComputed;
    },
    get useWatch() {
      return useWatch;
    },
    get useRef() {
      return useRef;
    },
    get useProvide() {
      return useProvide;
    },
    get useInject() {
      return useInject;
    },
    get useMemo() {
      return useMemo;
    },
    get useMounted() {
      return useMounted;
    },
    get useUpdated() {
      return useUpdated;
    },
    get useDestroyed() {
      return useDestroyed;
    },
    get useEffect() {
      return useEffect;
    },
    get createContext() {
      return createContext;
    },
    get useContext() {
      return useContext;
    },
    get withHooks() {
      return withHooks;
    },
  });

  // setup for useHooks
  _install(Vue);
}
