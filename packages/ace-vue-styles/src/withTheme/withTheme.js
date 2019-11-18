import useTheme from '../useTheme';


export function withThemeCreator(options = {}) {
  const { defaultTheme } = options;

  const withTheme = Component => {
    if (process.env.NODE_ENV !== 'production' && Component === undefined) {
      throw new Error(
        [
          'You are calling withTheme(Component) with an undefined component.',
          'You may have forgotten to import it.',
        ].join('\n')
      );
    }

    const WithTheme = {
      extends: Component,
      data() {
        return {
          theme: useTheme.call(this) || defaultTheme
        }
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      // Exposed for test purposes.
      WithTheme.Naked = Component;
    }

    return WithTheme;
  }

  return withTheme;
}

const withTheme = withThemeCreator();

export default withTheme;
