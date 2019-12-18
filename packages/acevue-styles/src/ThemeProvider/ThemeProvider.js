import { withHooks } from '@acevue/utils/vue-hooks';
import warning from 'warning';
import ThemeContext from '../useTheme/ThemeContext';
import useTheme from '../useTheme';
import nested from './nested';

// To support composition of theme.
function mergeOuterLocalTheme(outerTheme, localTheme) {
  if (typeof localTheme === 'function') {
    const mergedTheme = localTheme(outerTheme);

    warning(
      mergedTheme,
      [
        'Fabric-UI: you should return an object from your theme function, i.e.',
        '<ThemeProvider theme={() => ({})} />',
      ].join('\n'),
    );

    return mergedTheme;
  }

  return { ...outerTheme, ...localTheme };
}

const ThemeProvider = withHooks(
  {
    name: 'themeProvider',
    props: {
      theme: {
        tyep: Function || Object,
        required: true,
      },
    },
  },
  function(h, { props, children }) {
    const { theme: localTheme } = props;
    const outerTheme = useTheme.call(this);

    warning(
      outerTheme !== null || typeof localTheme !== 'function',
      [
        'Fabric-UI: you are providing a theme function property ' +
          'to the ThemeProvider component:',
        '<ThemeProvider theme={outerTheme => outerTheme} />',
        '',
        'However, no outer theme is present.',
        'Make sure a theme is already injected higher in the Vue tree ' +
          'or provide a theme object.',
      ].join('\n'),
    );

    const theme = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);
    if (outerTheme !== null && theme) theme[nested] = true;
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
  },
);

export default ThemeProvider;
