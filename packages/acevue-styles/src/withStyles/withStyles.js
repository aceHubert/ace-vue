import { getComponentName, sanitizeComponent } from '@acevue/utils/vue-component';
import StylesProvider from '../StylesProvider';
// import makeStyles from '../makeStyles';

const withStyles = (stylesOrCreator, options = {}) => Component => {
  const {
    defaultTheme,
    withTheme = false,
    name,
    // ...stylesOptions
  } = options;

  if (process.env.NODE_ENV !== 'production' && Component === undefined) {
    throw new Error(
      [
        'You are calling withStyles(styles)(Component) with an undefined component.',
        'You may have forgotten to import it.',
      ].join('\n'),
    );
  }

  let classNamePrefix = name;

  if (process.env.NODE_ENV !== 'production' && !name) {
    // Provide a better DX outside production.
    const displayName = getComponentName(Component);
    if (displayName !== undefined) {
      classNamePrefix = displayName;
    }
  }
  console.log(classNamePrefix);

  console.log(sanitizeComponent(StylesProvider).options);
  // const useStyles = makeStyles(stylesOrCreator, {
  //   defaultTheme,
  //   Component,
  //   name: name || getComponentName(Component),
  //   classNamePrefix,
  //   ...stylesOptions,
  // });

  // const classes = useStyles;

  const inject = {
    styleOptions: {
      default: {},
    },
  };

  if (withTheme) {
    inject.theme = { default: defaultTheme };
  }

  const WithStyles = {
    extends: Component,
    // components: { StylesProvider },
    inject,
    data() {
      console.log(this);
      return {
        classes: {},
      };
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    // Exposed for test purposes.
    WithStyles.Naked = Component;
    WithStyles.options = options;
    WithStyles.useStyles = {};
  }

  return WithStyles;
};

export default withStyles;
