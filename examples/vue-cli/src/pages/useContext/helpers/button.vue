<template>
  <consumer>
    <template v-slot="{ bgColor, frColor }">
      <button :style="{ backgroundColor: bgColor, color: frColor }">
        <slot>Default</slot>
      </button>
    </template>
  </consumer>
</template>

<script lang="ts">
import Vue from 'vue';
import MyContext from './myContext';

export default Vue.extend({
  name: 'Button',
  components: {
    Consumer: MyContext.Consumer,
  },
});
</script>
