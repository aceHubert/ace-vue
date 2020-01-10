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

        return h('div', {}, [String(b.current)]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(b!.current).toBe(2);
    expect(vm.$el.textContent).toBe('2');
    a!.current = 2;
    expect(b!.current).toBe(3);
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

  it('with setter', done => {
    let a: { current: number };
    let b: MutableRefObject<number>;
    const vm = new Vue(
      withHooks(h => {
        a = useData({ current: 1 });
        b = useComputed({
          get: () => a.current + 2,
          set: val => (a.current = val - 1),
        });

        return h('div', {}, [String(b.current)]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    // a:1 b:3
    expect(b!.current).toBe(3);
    expect(vm.$el.textContent).toBe('3');
    b!.current = 3;
    expect(a!.current).toBe(2);
    window
      .waitForUpdate(() => {
        // a:2 b:4
        expect(vm.$el.textContent).toBe('4');
        a!.current = 3;
        expect(b!.current).toBe(5);
      })
      .then(() => {
        // a:3 b:5
        expect(vm.$el.textContent).toBe('5');
        b!.current = 2;
        expect(a!.current).toBe(1);
      })
      .then(() => {
        // a:1 b:3
        expect(vm.$el.textContent).toBe('3');
      })
      .then(done);
  });

  it('caching', () => {
    const spy = jest.fn();
    let a: MutableRefObject<number>;
    let b: Readonly<RefObject<number>>;
    new Vue(
      withHooks(h => {
        a = useData(1);
        b = useComputed(() => {
          spy();
          return a.current + 1;
        });

        return h('div', {}, String(a.current));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(spy.mock.calls.length).toBe(1);
    b!.current;
    expect(spy.mock.calls.length).toBe(1);
    a!.current = 2;
    expect(spy.mock.calls.length).toBe(2);
  });
});
