import Vue, { ComponentOptions } from 'vue';
import { withHooks, useData, useMemo } from '../../src';

describe('apis/useMemo', () => {
  it('should works', done => {
    let data: { a: number; b: number; c: number };
    let result: number;
    let calls = 0;
    new Vue(
      withHooks(h => {
        data = useData({
          a: 1,
          b: 2,
          c: 3,
        });
        result = useMemo(() => {
          calls++;
          return data.a + data.b;
        }, [data.a, data.b]);

        return h('div', String(result));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(data!.a).toBe(1);
    expect(result!).toBe(3);
    expect(calls).toBe(1);
    data!.c = 4;
    window
      .waitForUpdate(() => {
        // c is not on dependencies, the funcion will not execite
        expect(data!.a).toBe(1);
        expect(result!).toBe(3);
        expect(calls).toBe(1);
        data!.a = 3;
      })
      .then(() => {
        expect(data!.a).toBe(3);
        expect(result!).toBe(5);
        expect(calls).toBe(2);
      })
      .then(done);
  });

  it('empty array dependencies', done => {
    let data: { a: number; b: number };
    let result: number;
    let calls = 0;
    new Vue(
      withHooks(h => {
        data = useData({
          a: 1,
          b: 2,
        });
        result = useMemo(() => {
          calls++;
          return data.a + data.b;
        }, []);
        return h('div', String(result));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(result!).toBe(3);
    expect(calls).toBe(1);
    data!.a = 2;
    window
      .waitForUpdate(() => {
        // function only execute once
        expect(result!).toBe(3);
        expect(calls).toBe(1);
      })
      .then(done);
  });

  it('undefined dependencies', done => {
    let data: { a: number; b: number };
    let result: number;
    let calls = 0;
    new Vue(
      withHooks(h => {
        data = useData({
          a: 1,
          b: 2,
        });
        result = useMemo(() => {
          calls++;
          return data.a + data.b;
        }, undefined);

        return h('div', String(result));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(result!).toBe(3);
    expect(calls).toBe(1);
    data!.a = 2;
    window
      .waitForUpdate(() => {
        // function only execute once
        expect(result!).toBe(3);
        expect(calls).toBe(1);
      })
      .then(done);
  });
});
