import Vue from 'vue';

let warn: any;

describe('useHooks', () => {
  beforeEach(() => {
    warn = jest.spyOn(global.console, 'error').mockImplementation(() => null);
  });
  afterEach(() => {
    warn.mockRestore();
  });

  it('should works', () => {
    const vm = new Vue({
      useHooks() {
        const a = Vue.useData(1);
        // todo: remove a's ref and add reactivity on return
        return {
          a,
        };
      },
      render(h) {
        return h('div', this.a.current);
      },
    }).$mount();
    expect(vm.a.current).toBe(1);
  });

  // it('should receive props as first params', () => {
  //   let props: any
  //   new Vue({
  //     props: ['a'],
  //     useHooks (_props) {
  //       props = _props
  //       return {}
  //     },
  //     render (h) {
  //       return h('div')
  //     },
  //     propsData: {
  //       a: 1
  //     }
  //   }).$mount()
  //   expect(props.a).toBe(1)
  // })

  // it('should work with `methods` and `data` options', done => {
  //   let calls = 0

  //   const vm = new Vue({
  //     useHooks () {
  //       const a = Vue.useData(1)
  //       return {
  //         a
  //       }
  //     },
  //     beforeUpdate () {
  //       calls++
  //     },
  //     beforeMount () {
  //       console.log('beforeMount')
  //     },
  //     mounted () {
  //       console.log('mounted')
  //       this.m()
  //     },
  //     data () {
  //       return {
  //         b: 0
  //       }
  //     },
  //     methods: {
  //       m () {
  //         console.log(this._self.a)
  //         this.b = this.a
  //       },
  //     },
  //     render (h) {
  //       console.log('render', this.a)
  //       return h('div', [this.a, this.b, this.c])
  //     }
  //   }).$mount()
  //   expect(vm.a).toBe(1)
  //   expect(vm.b).toBe(1)
  //   console.log('set a', vm.a)
  //   vm.a = 2
  //   window.waitForUpdate(() => {
  //     console.log('get a', vm.a)
  //     expect(calls).toBe(1)
  //     expect(vm.a).toBe(2)
  //     expect(vm.b).toBe(1)
  //     vm.b = 2
  //   })
  //     .then(() => {
  //       expect(calls).toBe(2)
  //       expect(vm.a).toBe(2)
  //       expect(vm.b).toBe(2)
  //     })
  //     .then(done)
  // })
});
