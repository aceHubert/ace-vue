import Vue from 'vue';
import { createContext, withHooks, useContext } from '../../src';

describe('api/createContext', () => {
  let warn: any;
  beforeEach(() => {
    warn = jest.spyOn(global.console, 'error').mockImplementation(() => null);
  });
  afterEach(() => {
    warn.mockRestore();
  });
  it('should works with Consumer', done => {
    const MyContext = createContext(100);

    const vm = new Vue({
      data() {
        return {
          val: 0,
        };
      },
      render(h: any) {
        return h('div', {}, [
          h(
            MyContext.Provider,
            {
              props: { value: this.val },
            },
            [
              h(MyContext.Consumer, {
                scopedSlots: {
                  default: (val: any) => h('span', {}, val),
                },
              }),
            ],
          ),
        ]);
      },
    }).$mount();

    const $span = vm.$el.querySelector('span');
    expect($span?.textContent).toBe('0');
    vm.val = 1;
    window
      .waitForUpdate(() => {
        expect($span?.textContent).toBe('1');
      })
      .then(done);
  });

  it('nested data reactivity', done => {
    const MyContext = createContext(100);

    const vm = new Vue({
      data() {
        return {
          val1: 0,
          val2: 'aa',
        };
      },
      render(h: any) {
        return h('div', {}, [
          h(
            MyContext.Provider,
            {
              attrs: {
                name: 'level-1',
              },
              props: { value: this.val1 },
            },
            [
              h('div', {}, [
                h(MyContext.Consumer, {
                  attrs: {
                    name: 'level-1',
                  },
                  scopedSlots: {
                    default: (val: any) => h('span', { class: 'level-1' }, val),
                  },
                }),
                h(
                  MyContext.Provider,
                  {
                    attrs: {
                      name: 'level-2',
                    },
                    props: { value: this.val2 },
                  },
                  [
                    h(MyContext.Consumer, {
                      attrs: {
                        name: 'level-2',
                      },
                      scopedSlots: {
                        default: (val: any) => h('span', { class: 'level-2' }, val),
                      },
                    }),
                  ],
                ),
              ]),
            ],
          ),
        ]);
      },
    }).$mount();

    const $span1 = vm.$el.querySelector('span.level-1');
    const $span2 = vm.$el.querySelector('span.level-2');
    expect($span1?.textContent).toBe('0');
    expect($span2?.textContent).toBe('aa');
    vm.val1 = 1;
    window
      .waitForUpdate(() => {
        expect($span1?.textContent).toBe('1');
        expect($span2?.textContent).toBe('aa');
        vm.val2 = 'bb';
      })
      .then(() => {
        expect($span1?.textContent).toBe('1');
        expect($span2?.textContent).toBe('bb');
      })
      .then(done);
  });

  it('should works with useContext', done => {
    const MyContext = createContext({ text: '', classes: '' });

    const ChildComponent = withHooks(h => {
      const { text, classes } = useContext(MyContext);
      return h('span', { class: classes }, [String(text)]);
    });

    const vm = new Vue({
      data() {
        return {
          val1: 0,
          val2: 'aa',
        };
      },
      render(h: any) {
        return h('div', {}, [
          h(
            MyContext.Provider,
            {
              props: { value: { text: this.val1, classes: 'level-1' } },
            },
            [
              h('div', {}, [
                h(ChildComponent),
                h(
                  MyContext.Provider,
                  {
                    props: {
                      value: { text: this.val2, classes: 'level-2' },
                    },
                  },
                  [h(ChildComponent)],
                ),
              ]),
            ],
          ),
        ]);
      },
    }).$mount();

    const $span1 = vm.$el.querySelector('span.level-1');
    const $span2 = vm.$el.querySelector('span.level-2');
    expect($span1?.textContent).toBe('0');
    expect($span2?.textContent).toBe('aa');
    vm.val1 = 1;
    window
      .waitForUpdate(() => {
        expect($span1?.textContent).toBe('1');
        expect($span2?.textContent).toBe('aa');
        vm.val2 = 'bb';
      })
      .then(() => {
        expect($span1?.textContent).toBe('1');
        expect($span2?.textContent).toBe('bb');
      })
      .then(done);
  });

  it('single root element warning', () => {
    const MyContext = createContext(100);

    new Vue({
      data() {
        return {
          val: 0,
        };
      },
      render(h: any) {
        return h('div', {}, [
          h(
            MyContext.Provider,
            {
              props: { value: this.val },
            },
            [
              h(MyContext.Consumer, {
                scopedSlots: {
                  default: (val: any) => [h('span', {}, val), h('span')],
                },
              }),
              h('span'),
            ],
          ),
        ]);
      },
    }).$mount();

    expect(warn.mock.calls[0][0]).toMatch(
      '[@acevue/hooks] createContext: Context.Provider must have a single root element',
    );
    expect(warn.mock.calls[1][0]).toMatch(
      '[@acevue/hooks] createContext: Context.Consumer must have a single root element',
    );
  });
});
