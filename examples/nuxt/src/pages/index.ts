import Vue from 'vue';
import Component from 'vue-class-component';

@Component
class Index extends Vue {
  theme = {
    secondary: 'red',
  };

  handleChangeTheme() {
    // const { theme } = this;
    // theme.primary = 'red';
    // theme.secondary = 'blue';
  }

  render(h: any) {
    return h('div');
  }
}

export default Index;
