<template>
  <div id="app">
    <consumer-demo />
  </div>
</template>

<script>
import ConsumerDemo from './pages/useContext/useConsumer';

export default {
  name: 'app',
  components: {
    ConsumerDemo,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
