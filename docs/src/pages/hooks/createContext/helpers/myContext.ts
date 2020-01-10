import Vue from 'vue';

export type Theme = {
  bgColor: string;
  frColor: string;
};

const MyContext = Vue.createContext<Theme>({ bgColor: '#ddd', frColor: '#000' });

export default MyContext;
