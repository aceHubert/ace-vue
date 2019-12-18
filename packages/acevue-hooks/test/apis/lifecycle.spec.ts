import Vue, { ComponentOptions } from 'vue';
import { MutableRefObject } from '../../src/types/apis';
import { withHooks, useData, useMounted, useUpdated, useDestroyed } from '../../src';

describe('apis/lifecycle', () => {
  it('useMounted should works', done => {
    const spy = jest.fn();
    let data: MutableRefObject<boolean>;
    new Vue(
      withHooks(h => {
        data = useData(false);

        useMounted(() => {
          spy();
        });

        return h('div');
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(spy.mock.calls.length).toBe(1);
    data!.current = true;
    window
      .waitForUpdate(() => {
        // already mounted, will not execute again
        expect(spy.mock.calls.length).toBe(1);
      })
      .then(done);
  });

  it('useUpdated should works', done => {
    const spy = jest.fn();
    let data: MutableRefObject<number>;
    new Vue(
      withHooks(h => {
        data = useData(1);

        useUpdated(() => {
          spy();
        });

        return h('div', {}, [String(data.current)]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(spy.mock.calls.length).toBe(0);
    data!.current = 2;
    window
      .waitForUpdate(() => {
        expect(spy.mock.calls.length).toBe(1);
      })
      .then(done);
  });

  it('useUpdated with dependencies', done => {
    const spy = jest.fn();
    let data: { arr: any[]; obj: { a: string }; c: boolean; d: any };
    new Vue(
      withHooks(h => {
        data = useData({
          arr: [1],
          obj: { a: '3' },
          c: false,
          d: 0,
        });

        useUpdated(() => {
          spy();
        }, [data.arr, data.obj, data.c]);

        return h('div', {}, [
          String(data.arr.length),
          String(data.obj.a),
          String(data.c),
          String(data.d),
        ]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(spy.mock.calls.length).toBe(0);
    data!.arr = [1, 2];
    window
      .waitForUpdate(() => {
        expect(spy.mock.calls.length).toBe(1);
        data!.obj = { a: '4' };
      })
      .then(() => {
        expect(spy.mock.calls.length).toBe(2);
        data!.c = true;
      })
      .then(() => {
        expect(spy.mock.calls.length).toBe(3);
        data!.d = 'not update';
      })
      .then(() => {
        // d is not in the dependencies
        expect(spy.mock.calls.length).toBe(3);
      })
      .then(done);
  });

  it('useDestroyed should works', done => {
    const spy = jest.fn();
    const vm = new Vue(
      withHooks(h => {
        useDestroyed(() => {
          spy();
        });

        return h('div', {}, null);
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(spy.mock.calls.length).toBe(0);
    vm.$destroy();
    window
      .waitForUpdate(() => {
        expect(spy.mock.calls.length).toBe(1);
      })
      .then(done);
  });
});
