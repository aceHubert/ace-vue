import Vue from 'vue';
// import Component from 'vue-class-component';
// import warning from 'warning';
// import { create } from 'jss';
// import jssPreset from '../jssPreset';
// import createGenerateClassName from '../createGenerateClassName';

// // Default JSS instance.
// const jss = create(jssPreset());

// // Use a singleton or the provided one by the context.
// //
// // The counter-based approach doesn't tolerate any mistake.
// // It's much safer to use the same counter everywhere.
// const generateClassName = createGenerateClassName();

// // Exported for test purposes
// export const sheetsManager = new Map();

// const defaultOptions = {
//   disableGeneration: false,
//   generateClassName,
//   jss,
//   sheetsCache: null,
//   sheetsManager,
//   sheetsRegistry: null,
// };

// let injectFirstNode;

// @Component({
//   name: 'stylesProvider',
//   inject: {
//     outerOptions: { from: 'styleOptions', default: defaultOptions }
//   },
//   provide() {
//     const { outerOptions, injectFirst, ...localOptions } = this;
//     const context = { ...outerOptions, ...localOptions };

//     warning(
//       typeof window !== 'undefined' || context.sheetsManager,
//       'Fabric-UI: you need to use the ServerStyleSheets API when rendering on the server.',
//     );

//     warning(
//       !context.jss.options.insertionPoint || !injectFirst,
//       'Fabric-UI: you cannot use a custom insertionPoint and <StylesContext injectFirst> at the same time.',
//     );

//     warning(
//       !injectFirst || !localOptions.jss,
//       'Fabric-UI: you cannot use the jss and injectFirst props at the same time.',
//     );

//     if (!context.jss.options.insertionPoint && injectFirst && typeof window !== 'undefined') {
//       if (!injectFirstNode) {
//         const head = document.head;
//         injectFirstNode = document.createComment('fui-inject-first');
//         head.insertBefore(injectFirstNode, head.firstChild);
//       }

//       context.jss = create({ plugins: jssPreset().plugins, insertionPoint: injectFirstNode });
//     }
//     console.log(context)
//     return {
//       styleOptions: context
//     }
//   },
//   props: {
//     disableGeneration: {
//       type: Boolean,
//       default: false
//     },
//     generateClassName: Function,
//     injectFirst: {
//       type: Boolean,
//       default: false
//     },
//     jss: Object
//   },
//   render(h) {
//     return <div name="stylesProvider">{this.$slots.default}</div>;
//   }
// })
class SytlesProvider extends Vue {}

export default SytlesProvider;
