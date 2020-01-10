import Vue from 'vue';

//Vue.observable works in 2.6+
export function observe<T>(obj: T): T {
  if (Vue.observable) {
    return Vue.observable(obj);
  }
  return new Vue({
    data() {
      return obj;
    },
  }).$data as T;
}
