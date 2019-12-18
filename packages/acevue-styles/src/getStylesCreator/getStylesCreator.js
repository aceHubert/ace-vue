import warning from 'warning';
import deepmerge from 'deepmerge';
import noopTheme from './noopTheme';

// Support for the jss-expand plugin.
function arrayMerge(destination, source) {
  return source;
}

const getStylesCreator = stylesOrCreator => {
  const themingEnabled = typeof stylesOrCreator === 'function';

  warning(
    typeof stylesOrCreator === 'object' || themingEnabled,
    [
      'Fabric-UI: the `styles` argument provided is invalid.',
      'You need to provide a function generating the styles or a styles object.',
    ].join('\n'),
  );

  return {
    create: (theme, name) => {
      let styles;
      try {
        styles = themingEnabled ? stylesOrCreator(theme) : stylesOrCreator;
      } catch (err) {
        warning(
          !themingEnabled || theme !== noopTheme,
          [
            'Fabric-UI: the `styles` argument provided is invalid.',
            'You are providing a function without a theme in the context.',
            'One of the parent elements needs to use a ThemeProvider.',
          ].join('\n'),
        );
        throw err;
      }

      if (!name || !theme.overrides || !theme.overrides[name]) {
        return styles;
      }

      const overrides = theme.overrides[name];
      const stylesWithOverrides = { ...styles };

      Object.keys(overrides).forEach(key => {
        warning(
          stylesWithOverrides[key],
          [
            'Fabric-UI: you are trying to override a style that does not exist.',
            `Fix the \`${key}\` key of \`theme.overrides.${name}\`.`,
          ].join('\n'),
        );
        stylesWithOverrides[key] = deepmerge(stylesWithOverrides[key], overrides[key], {
          arrayMerge,
        });
      });

      return stylesWithOverrides;
    },
    options: {},
    themingEnabled,
  };
};

export default getStylesCreator;
