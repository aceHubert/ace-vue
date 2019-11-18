

import StylesProvider from '../StylesProvider';
import getStylesCreator from '../getStylesCreator';
import mergeClasses from '../mergeClasses';
import { increment } from './indexCounter';
import noopTheme from '../getStylesCreator/noopTheme';


function getClasses({ state, stylesOptions }, classes, Component) {
  if (stylesOptions.disableGeneration) {
    return classes || {};
  }

  if (!state.cacheClasses) {
    state.cacheClasses = {
      // Cache for the finalized classes value.
      value: null,
      // Cache for the last used classes prop pointer.
      lastProp: null,
      // Cache for the last used rendered classes pointer.
      lastJSS: {},
    };
  }

  // Tracks if either the rendered classes or classes prop has changed,
  // requiring the generation of a new finalized classes object.
  let generate = false;

  if (state.classes !== state.cacheClasses.lastJSS) {
    state.cacheClasses.lastJSS = state.classes;
    generate = true;
  }
  if (classes !== state.cacheClasses.lastProp) {
    state.cacheClasses.lastProp = classes;
    generate = true;
  }

  if (generate) {
    state.cacheClasses.value = mergeClasses({
      baseClasses: state.cacheClasses.lastJSS,
      newClasses: classes,
      Component,
    });
  }

  return state.cacheClasses.value;
}


function attach({ state, theme, stylesOptions, stylesCreator, name }, props) {


}

const makeStyles = (styleOrCreator, options) => {
  const {
    // alias for classNamePrefix, if provided will listen to theme (required for theme.overrides)
    name,
    // Help with debuggability.
    classNamePrefix: classNamePrefixOption,
    Component,
    defaultTheme = noopTheme,
    ...stylesOptions2
  } = options;
  const stylesCreator = getStylesCreator(styleOrCreator)
  const classNamePrefix = name || classNamePrefixOption || 'makeStyles';
  stylesCreator.options = {
    index: increment(),
    name,
    meta: classNamePrefix,
    classNamePrefix,
  };

  const listenToTheme = stylesCreator.themingEnabled || typeof name === 'string';

  return {
    inject: {
      outerTheme:{ from: 'theme', default: noopTheme},
      outerClasses: { from : 'classes', default: {}}
    },
    provide(){
      return{
       classes: getClasses(this.outerClasses, props.classes, Component)
      }
    },
    extends: StylesProvider,
    data(){
      return{
        theme: (listenToTheme ? this.outerTheme: null) || defaultTheme
      }
    }

  }

  return (props = {}) => {
    /* eslint-disabled spaced-comment */
    const theme = (listenToTheme ? {/**todo */ } : null) || defaultTheme;
    const stylesOptions = {
      // ...React.useContext(StylesContext),
      ...stylesOptions2,
    };

    useSynchronousEffect(() => {
      const current = {
        name,
        state: {},
        stylesCreator,
        stylesOptions,
        theme,
      };

      attach(current, props);

      shouldUpdate.current = false;
      instance.current = current;
      return () => {
        detach(current);
      };
    }, [theme, stylesCreator]);

    React.useEffect(() => {
      if (shouldUpdate.current) {
        update(instance.current, props);
      }
      shouldUpdate.current = true;
    });

    return getClasses(instance.current, props.classes, Component);
  };

  // const { classes } = jss.createStyleSheet(styleOrCreator).attach();
  // return classes;
}

export default makeStyles;
