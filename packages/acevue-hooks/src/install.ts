import { VueConstructor } from 'vue';
import { assert } from './utils';
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
} from './apis';

// eslint-disable-next-line no-shadow
export function install(Vue: VueConstructor, _install: (Vue: VueConstructor) => void) {
  if (currentVue && currentVue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, 'already installed. Vue.use(plugin) should be called only once');
    }
    return;
  }

  // Vue.config.optionMergeStrategies.setup = function(parent: Function, child: Function) {
  //   return function mergedSetupFn(props: any, context: any) {
  //     return mergeData(
  //       typeof child === 'function' ? child(props, context) || {} : {},
  //       typeof parent === 'function' ? parent(props, context) || {} : {}
  //     )
  //   }
  // }

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
