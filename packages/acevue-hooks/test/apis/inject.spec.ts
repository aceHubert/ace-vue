import Vue from 'vue';
import { withHooks, useProvide, useInject, useData } from '../../src';

describe('apis/useInject', () => {
  // @ts-ignore
  let warn: any;
  beforeEach(() => {
    warn = jest.spyOn(global.console, 'error').mockImplementation(() => null);
  });
  afterEach(() => {
    warn.mockRestore();
  });
  it('should works with string key', () => {
    const Parent = withHooks((h, _props, { slots }) => {
      useProvide('provideKey', { a: 'aa' });
      return h('div', {}, slots['default']);
    });
    const Child = withHooks(h => {
      const parentVal = useInject('provideKey') as { a: string };
      return h('span', {}, parentVal.a);
    });

    const vm = new Vue({
      render(h) {
        return h(Parent, {}, [h(Child)]);
      },
    }).$mount();

    expect(vm.$el.querySelector('span')?.textContent).toBe('aa');
  });

  it('should works with Symbol key', () => {
    const key = Symbol('provideKey');
    const Parent = withHooks((h, _props, { slots }) => {
      useProvide(key, { a: 'aa' });
      return h('div', {}, slots['default']);
    });
    const Child = withHooks(h => {
      const parentVal = useInject(key) as { a: string };
      return h('span', {}, parentVal.a);
    });

    const vm = new Vue({
      render(h) {
        return h(Parent, {}, [h(Child)]);
      },
    }).$mount();

    expect(vm.$el.querySelector('span')?.textContent).toBe('aa');
  });

  it('should works with defaultValue', () => {
    const Parent = withHooks((h, _props, { slots }) => {
      return h('div', {}, slots['default']);
    });
    const Child = withHooks(h => {
      const parentVal = useInject('parentVal', { a: 'aa' }) as { a: string };
      return h('span', {}, parentVal.a);
    });

    const vm = new Vue({
      render(h) {
        return h(Parent, {}, [h(Child)]);
      },
    }).$mount();

    expect(vm.$el.querySelector('span')?.textContent).toBe('aa');
  });

  it('should reactive with provide object datas changing', done => {
    let data: { a: string };
    const Parent = withHooks((h, _props, { slots }) => {
      data = useData({ a: 'aa' });
      useProvide('provideKey1', data);

      return h('div', {}, slots['default']);
    });
    const Child = withHooks(h => {
      const parentVal = useInject('provideKey1') as { a: string };

      return h('span', {}, parentVal.a);
    });

    const vm = new Vue({
      render(h) {
        return h(Parent, {}, [h(Child)]);
      },
    }).$mount();

    const $span = vm.$el.querySelector('span');
    expect($span?.textContent).toBe('aa');
    data!.a = 'bb';
    window
      .waitForUpdate(() => {
        expect($span?.textContent).toBe('bb');
      })
      .then(done);
  });

  it('provide a null/undefined value', () => {
    const Parent = withHooks((h, _props, { slots }) => {
      useProvide('nullValue', null);
      useProvide('undefValue', undefined);
      return h('div', {}, slots['default']);
    });
    let nullValue: any, undefValue: any;
    const Child = withHooks(h => {
      nullValue = useInject('nullValue');
      undefValue = useInject('undefValue');
      return h('span');
    });

    new Vue({
      render(h) {
        return h(Parent, {}, [h(Child)]);
      },
    }).$mount();

    expect(nullValue).toBeNull;
    expect(undefValue).toBeUndefined;
  });

  it('warn with no provided and no defaultValue', () => {
    const Parent = withHooks((h, _props, { slots }) => {
      return h('div', {}, slots['default']);
    });

    const Child = withHooks(h => {
      const emptyValue = useInject('emptyValue');
      return h('span', {}, JSON.stringify(emptyValue));
    });

    new Vue({
      render(h) {
        return h(Parent, {}, [h(Child)]);
      },
    }).$mount();

    expect(warn.mock.calls[0][0]).toMatch('[@acevue/hooks] Injection "emptyValue" not found');
  });
});
