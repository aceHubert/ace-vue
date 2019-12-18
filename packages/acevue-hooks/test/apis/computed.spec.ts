import Vue, { ComponentOptions } from 'vue';
import { RefObject, MutableRefObject } from '../../src/types/apis';
import { withHooks, useData, useComputed } from '../../src';

describe('apis/useComputed', () => {
  it('basic usage', done => {
    let a: MutableRefObject<number>;
    let b: Readonly<RefObject<number>>;
    const vm = new Vue(
      withHooks(h => {
        a = useData(1);
        b = useComputed(() => {
          return a.current + 1;
        });

        console.log('render', b.current);
        return h('div', {}, [String(b.current), String(a.current)]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(b!.current).toBe(2);
    expect(vm.$el.textContent).toBe('21');
    a!.current = 2;
    expect(b!.current).toBe(3);
    a!.current = 3;
    a!.current = 2;
    window
      .waitForUpdate(() => {
        expect(vm.$el.textContent).toBe('3');
        a!.current = 3;
        expect(b!.current).toBe(4);
      })
      .then(() => {
        expect(vm.$el.textContent).toBe('4');
      })
      .then(done);
  });

  // it('with setter', (done) => {
  //   let a: { value: number }
  //   let b: MutableRefObject<number>
  //   // let fn: (val: number) => void
  //   const vm = new Vue(withHooks((h) => {
  //     a = useData({ value: 1 })
  //     b = useComputed({
  //       get: () => a.value + 2,
  //       set: (val) => (a.value = val - 1)
  //     })

  //     // useMounted(() => {
  //     //   fn = (val) => {
  //     //     a.value = val
  //     //   }
  //     // })

  //     console.log('render', b.current)

  //     return h('div', {}, String(b.current))
  //   }) as ComponentOptions<Vue>).$mount()

  //   // b!.current = 3
  //   a!.value = 2
  //   window.waitForUpdate(() => {
  //     expect(vm.$el.textContent).toBe('4')
  //     // b!.current = 5
  //     // fn(4)
  //     a.value = 4
  //   }).then(() => {
  //     expect(vm.$el.textContent).toBe('6')
  //   }).then(done)

  //   // // a: 1 b: 3
  //   // expect(b!.current).toBe(3)
  //   // expect(vm.$el.textContent).toBe('3')
  //   // a!.value = 2
  //   // expect(b!.current).toBe(4)
  //   // window.waitForUpdate(() => {
  //   //   // a: 2 b: 4
  //   //   expect(vm.$el.textContent).toBe('4')
  //   //   // @ts-ignore
  //   //   // b!.current = 2
  //   //   fn(2)
  //   //   expect(a!.value).toBe(1)
  //   // }).then(() => {
  //   //   // a: 0 b:1
  //   //   expect(vm.$el.textContent).toBe('3')
  //   // }).then(done)
  // })

  // it('caching', () => {
  //   const spy = jest.fn();
  //   let a: MutableRefObject<number>
  //   let b: Readonly<RefObject<number>>
  //   new Vue(withHooks((h) => {
  //     a = useData(useRef(1))
  //     b = useComputed(() => {
  //       spy()
  //       return a.current + 1
  //     })

  //     return h('div', {}, String(b.current))
  //   }) as ComponentOptions<Vue>).$mount()

  //   expect(spy.mock.calls.length).toBe(1)
  //   b!.current
  //   expect(spy.mock.calls.length).toBe(1)
  //   a!.current = 2
  //   expect(spy.mock.calls.length).toBe(2)
  // })

  // it('test', (done) => {
  //   const vm = new Vue({
  //     data () {
  //       return {
  //         count: 0
  //       }
  //     },
  //     beforeMount () {
  //       const vm = this
  //       const store = (vm._computedStore = vm._computedStore || {})
  //       console.log('mounted')
  //       const getter = () => this.count + 1
  //       store[0] = getter()
  //       // @ts-ignore：sync 不在WatchOptions 中
  //       this.$watch(getter, val => {
  //         console.log('set', val)
  //         store[0] = val
  //       }, { sync: true })
  //     },
  //     render (h) {
  //       const vm = this
  //       const store = vm._computedStore
  //       console.log('render', store[0])
  //       return h('div', {}, store[0])
  //     }
  //   }).$mount()

  //   vm.count = 3
  //   window.waitForUpdate(()=>{
  //     expect(vm.$el.textContent).toBe('2')
  //   }).then(done)
  // })
});
