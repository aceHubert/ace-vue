import { VueConstructor } from 'vue';
import { createComponent, UseHooksContext, withHooks } from './component';
import { currentVue } from './runtimeContext';
import { install } from './install';
import { mixin } from './setup';
import version from './version';

const _install = (Vue: VueConstructor) => install(Vue, mixin);

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (currentVue && typeof window !== 'undefined' && window.Vue) {
  _install(window.Vue);
}

export * from './apis';

export { UseHooksContext, createComponent, withHooks };

export default {
  version, // todo: read it from package.json
  install: _install,
};
