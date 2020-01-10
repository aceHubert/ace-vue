<template>
  <div>
    <theme-provider :value="val1">
      <div>
        <theme-button>Level-1</theme-button>
        <theme-provider :value="val2">
          <theme-button>Level-2</theme-button>
        </theme-provider>
      </div>
    </theme-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ThemeProvider, Button } from './helpers';

export default Vue.extend({
  components: {
    ThemeProvider,
    ThemeButton: Button,
  },
  data() {
    return {
      val1: null,
      val2: null,
    };
  },
});
</script>
