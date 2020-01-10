import { useRef, withHooks } from '../../src';
import Vue, { ComponentOptions } from 'vue';

describe('apis/useRef', () => {
  it('should works', () => {
    new Vue(
      withHooks(h => {
        const data = useRef(1);

        expect(data.current).toBe(1);
        data.current = 2;
        expect(data.current).toBe(2);

        return h('span');
      }) as ComponentOptions<Vue>,
    ).$mount();
  });
});
