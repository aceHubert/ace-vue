import { Vue, Component } from 'vue-property-decorator';
import { ThemeProvider, Theme, ThemeButton } from './helpers';

@Component
export default class UseConsumer extends Vue {
  val1: Theme | null = null;
  val2: Theme | null = null;

  render(h: Vue.CreateElement) {
    return (
      <div>
        <ThemeProvider value={this.val1}>
          <div>
            <ThemeButton>Level-1</ThemeButton>
            <ThemeProvider value={this.val2}>
              <ThemeButton>Level-2</ThemeButton>
            </ThemeProvider>
          </div>
        </ThemeProvider>
      </div>
    );
  }
}
