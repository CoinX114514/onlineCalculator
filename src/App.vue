<template>
  <div id="app">
    <h1></h1>
    <CalculatorLogic />
  </div>
</template>

<script>
import CalculatorLogic from './components/CalculatorLogic.vue';

export default {
  name: 'App',
  components: {
    CalculatorLogic 
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>