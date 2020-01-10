import MyContext, { Theme } from './myContext';

const ThemeProvider = MyContext.Provider;

export { default as ThemeButton } from './theme-button';
export { ThemeProvider, Theme };
