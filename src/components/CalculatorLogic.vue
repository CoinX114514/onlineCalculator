<template>
    <div class="calculator">
      <input type="text" v-model="display" readonly class="display" />
      <div class="buttons">
        <button v-for="button in buttonArray" :key="button" @click="handleClick(button)">
          {{ button }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'CalculatorLogic',
    setup() {
      const display = ref('');
      const buttonArray = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', 'Clear', '0', '=', '/'];
  
      function handleClick(button) {
        switch (button) {
          case 'Clear':
            display.value = '';
            break;
          case '=':
            try {
              const result = eval(display.value);
              display.value = (result < 10000000) ? result : 'Overflow';
            } catch (error) {
              display.value = 'Error';
            }
            break;
          default:
            display.value += button;
        }
      }
  
      return {
        display,
        buttonArray,
        handleClick
      };
    }
  }
  </script>
  
  <style>
    .calculator {
    display: inline-block;
    text-align: center;
    margin: 100px auto;
  }
  
    .display {
    width: 200px;
    height: 40px;
    text-align: right;
    margin-bottom: 10px;
}

    .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

    button {
    width: 50px;
    height: 50px;
    font-size: 20px;
    cursor: pointer;
}
</style>