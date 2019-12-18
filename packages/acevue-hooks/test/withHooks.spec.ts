import Vue, { ComponentOptions } from 'vue';

describe('withHooks', () => {
  it('should works', () => {
    const vm = new Vue(
      Vue.withHooks({ a: String }, h => {
        const data = Vue.useData({ count: 1 });
        return h('div', String(data.count));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(vm.$el.textContent).toBe('1');
  });

  it('slots should works', () => {
    const Parent = Vue.withHooks((h, _props, { slots }) => {
      return h('div', {}, slots['default']);
    });

    const Child = Vue.withHooks((h, _props, { slots }) => {
      return h('span', {}, [slots['default']]);
    });

    const vm = new Vue({
      render(h) {
        return h(Parent, {}, [h(Child, { slot: 'other' }, 'a'), h(Child, 'b')]);
      },
    }).$mount();

    expect(vm.$el.outerHTML).toBe('<div><span>b</span></div>');
  });

  it('scopedSlots should works', () => {
    const Parent = Vue.withHooks(['a'], (h, _props, { slots }) => {
      return h('div', {}, [slots['default']]);
    });

    const Child = Vue.withHooks((h, _props, { parent, scopedSlots }) => {
      return h('span', {}, [scopedSlots['default'](parent?.$props)]);
    });

    const vm = new Vue({
      render(h) {
        return h(
          Parent,
          {
            props: {
              a: '100',
            },
          },
          [
            h(
              Child,
              {
                scopedSlots: {
                  default: props => `value:${props.a}`,
                },
                slot: 'default',
              },
              'bbb',
            ),
          ],
        );
      },
    }).$mount();

    expect(vm.$el.outerHTML).toBe('<div><span>value:100</span></div>');
  });
});
