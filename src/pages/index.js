import Vue from "vue";
import Component from "vue-class-component";

@Component
class Index extends Vue {

  theme = {
    secondary: 'red'
  };

  handleChangeTheme() {
    const { theme } = this;
    theme.primary = 'red';
    theme.secondary = 'blue';
  }

  render(h) {
    return (
      <div></div>
    )
  }
}

export default Index;
