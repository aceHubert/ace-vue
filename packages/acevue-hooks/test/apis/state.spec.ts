import Vue, { ComponentOptions } from 'vue';
import { MutableRefObject, Dispatch, SetStateAction } from '../../src/types/apis';
import { withHooks, useData, useState } from '../../src';

describe('apis/useData', () => {
  it('with Primitive value', done => {
    let data: MutableRefObject<number>;
    const vm = new Vue(
      withHooks(h => {
        data = useData(1);

        return h('div', {}, String(data.current));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(data!.current).toBe(1);
    expect(vm.$el.textContent).toBe('1');
    data!.current = 2;
    expect(data!.current).toBe(2);
    window
      .waitForUpdate(() => {
        expect(vm.$el.textContent).toBe('2');
        data!.current = 3;
        expect(data!.current).toBe(3);
      })
      .then(() => {
        expect(vm.$el.textContent).toBe('3');
      })
      .then(done);
  });

  it('with Object Reference value', done => {
    let data: { count: number; obj: { a: boolean }; arr: any[] };
    const vm = new Vue(
      withHooks(h => {
        data = useData({
          count: 1,
          obj: { a: true },
          arr: ['3'],
        });

        return h('div', {}, [
          String(data.count),
          ',',
          String(data.obj.a),
          ',',
          String(data.arr.length),
        ]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(vm.$el.textContent).toBe('1,true,1');
    data!.count++;
    window
      .waitForUpdate(() => {
        expect(vm.$el.textContent).toBe('2,true,1');
        data.obj.a = false;
      })
      .then(() => {
        expect(vm.$el.textContent).toBe('2,false,1');
        data.arr.push('4');
      })
      .then(() => {
        expect(vm.$el.textContent).toBe('2,false,2');
      })
      .then(done);
  });

  it('with null', done => {
    let data: MutableRefObject<any>;
    const vm = new Vue(
      withHooks(h => {
        data = useData(null);

        return h('div', {}, String(data.current));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(vm.$el.textContent).toBe('null');
    data!.current = 2;
    window
      .waitForUpdate(() => {
        expect(vm.$el.textContent).toBe('2');
        data!.current = 3;
      })
      .then(() => {
        expect(vm.$el.textContent).toBe('3');
      })
      .then(done);
  });
});

describe('apis/useState', () => {
  it('with Primitive value', done => {
    let count: MutableRefObject<number>, setCount: Dispatch<SetStateAction<number>>;
    const vm = new Vue(
      withHooks(h => {
        const [_count, _setCount] = useState(1);
        count = _count;
        setCount = _setCount;

        return h('div', {}, [h('span', {}, String(_count.current))]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    const $span = vm.$el.querySelector('span')!;
    expect(count!.current).toBe(1);
    expect($span.textContent).toBe('1');
    setCount!(count!.current + 1);
    expect(count!.current).toBe(2);
    window
      .waitForUpdate(() => {
        expect($span.textContent).toBe('2');
        count!.current = 3;
      })
      .then(() => {
        expect($span.textContent).toBe('3');
      })
      .then(done);
  });

  it('with Object Reference value', done => {
    let data: { a: string }, setData: Dispatch<SetStateAction<{ a: string }>>;
    const vm = new Vue(
      withHooks(h => {
        const [_data, _setData] = useState({ a: 'aa' });
        data = _data;
        setData = _setData;

        return h('div', {}, [h('span', {}, String(_data.a))]);
      }) as ComponentOptions<Vue>,
    ).$mount();

    const $span = vm.$el.querySelector('span')!;
    expect(data!.a).toBe('aa');
    expect($span.textContent).toBe('aa');
    setData!({ a: 'bb' });
    window
      .waitForUpdate(() => {
        // here it gets the new data after rerender because 'setDate' update a new data
        expect(data!.a).toBe('bb');
        expect($span.textContent).toBe('bb');
        data!.a = 'cc';
      })
      .then(() => {
        expect($span.textContent).toBe('cc');
      })
      .then(done);
  });
});
