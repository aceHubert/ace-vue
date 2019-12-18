const hasSymbol = typeof Symbol === 'function';

export default hasSymbol ? Symbol.for('fui.nested') : '__THEME_NESTED__';
