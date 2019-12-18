import Vue, { ComponentOptions } from 'vue';
import { withHooks, useData } from '../../src';

describe('apis/useWatch', () => {
  it('should works', done => {
    let value: number;
    let data: { a: number };
    new Vue(
      withHooks(h => {
        data = useData({
          a: 1,
        });
        Vue.useWatch(
          () => data.a,
          newValue => {
            value = newValue;
          },
        );

        return h('div', {}, String(data.a));
      }) as ComponentOptions<Vue>,
    ).$mount();

    expect(data!.a).toBe(1);
    data!.a++;
    window
      .waitForUpdate(() => {
        expect(value).toBe(2);
      })
      .then(done);
  });
});
