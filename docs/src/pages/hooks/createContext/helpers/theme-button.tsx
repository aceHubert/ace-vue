import { Vue, Component } from 'vue-property-decorator';
import MyContext, { Theme } from './myContext';

@Component
export default class ThemeButton extends Vue {
  render(h: Vue.CreateElement) {
    return (
      <MyContext.Consumer
        {...{
          scopedSlots: {
            default: ({ bgColor, frColor }: Theme) => {
              return (
                <button style={{ backgroundColor: bgColor, color: frColor }}>
                  {this.$slots.default}
                </button>
              );
            },
          },
        }}
      />
    );
  }
}
