import { useContext } from '@ace-vue/utils/vue-hooks';
import ThemeContext from './ThemeContext';

export default function useTheme() {
  return useContext.call(this, ThemeContext);
}
