import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class LayoutDefault extends Vue {
  theme = createFuiTheme({
    type: "light"
  });



  handleChangeTheme () {
    const { theme } = this;
    // theme.type = theme.type === "light" ? "dark" : "light";  
    // console.log("changed theme to be ", theme.type);
    // theme.primary = 'red';
    theme.primary = theme.primary == 'grey' ? 'yellow' : 'grey';
  }
  render (h) {

    return (
      <div id="app">
        <nuxt />
      </div>
    );
  }
}
