<template>
  <div class="CalculatorLogic" :class="{ fadeIn: isVisible }">
    <input type="text" v-model="display" readonly class="display"/>
    <div class="buttons">
      <button v-for="button in buttonArray" :key="button" @click="handleClick(button)">
        {{ button }}
      </button>
      <button @click="toggleSound">Sound</button>
      <button @click="toggleDarkMode">Mode</button>
    </div>
  </div>
</template>
  


  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    name: 'CalculatorLogic',
    setup() {
      const display = ref('');
      const soundEnabled =ref(false)
      //load yuyingfangsong

      const audioFiles = {
        '0': new Audio('./src/assets/Cal-0.m4a'),
        '1': new Audio('./src/assets/Cal-1.m4a'),
        '2': new Audio('./src/assets/Cal-2.m4a'),
        '3': new Audio('./src/assets/Cal-3.m4a'),
        '4': new Audio('./src/assets/Cal-4.m4a'),
        '5': new Audio('./src/assets/Cal-5.m4a'),
        '6': new Audio('./src/assets/Cal-6.m4a'),
        '7': new Audio('./src/assets/Cal-7.m4a'),
        '8': new Audio('./src/assets/Cal-8.m4a'),
        '9': new Audio('./src/assets/Cal-9.m4a'),
        '+': new Audio('./src/assets/Cal-Plus.m4a'),
        '-': new Audio('./src/assets/Cal-Minus.m4a'),
        '*': new Audio('./src/assets/Cal-Times.m4a'),
        '/': new Audio('./src/assets/Cal-Div.m4a'),
        '=': new Audio('./src/assets/Cal-Equal.m4a'),
        'AC': new Audio('./src/assets/Cal-AC.m4a'),
        '.': new Audio('./src/assets/Cal-dot.m4a'),
        '√': new Audio('./src/assets/Cal-SQRT.m4a'),
        'Sound': new Audio('./src/assets/Cal-Sound.m4a'),
        'Mode': new Audio('./src/assets/Cal-Darkmode.m4a'),
        };


      //buttons
      const buttonArray = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', 'AC', '0', '=', '/', '.', '√'];

      const isVisible = ref(false);//fade effect conponent

      function handleClick(button) {
        const operators = ["+", "-", "*", "/"];
        const lastChar = display.value.slice(-1); 

        if(soundEnabled.value && audioFiles[button]){
          audioFiles[button].play();
        }

        if (typeof display.value !== 'string') {
          display.value = String(display.value);
        }

        switch (button) {
          case 'AC':
            display.value = '';
            break;
        case '=':
          try {
            const result = String(eval(display.value)); 
            display.value = (result < 10000000) ? result : 'Overflow'; 

            setTimeout(() => {
              display.value='';
            }, 100000);//Auto AC control
            

          } catch (error) {
            display.value = 'Error'; 
          }
          break;

        case 'sqrt':
          try {
            const evaluatedResult = eval(display.value); 
            if (evaluatedResult < 0) {
              display.value = 'Error'; 
            } else {
              const result = Math.sqrt(evaluatedResult); 
              display.value = (result < 10000000) ? result : 'Overflow';
            }
          }catch (error) {
            display.value = 'Error';
          }
          break;

        default:
          if (operators.includes(button) && operators.includes(lastChar)) {
            return; 
          } else if (display.value === '0') {
            display.value = button; 
          } else {
            display.value += button; 
          }
        }
}
      function toggleSound(){
        soundEnabled.value = !soundEnabled.value;
      }

      onMounted(()=>{
        setTimeout(()=>{
          isVisible.value = true;
        },100)
      });

      return {
        display,
        buttonArray,
        handleClick,
        isVisible,
        toggleSound
      };
    }
  }
  </script>
  

  <style scoped>
  .calculator {
    display: inline-block;
    text-align: center;
    margin: 100px auto;
    opacity: 0; 
    transition: opacity 1s ease-in; 
  }

  .fadeIn {
    opacity: 1; 
  }

  .display {
    width: calc(100% - 20px); 
    height: 150px;
    font-size: 20px;
    text-align: left;
    margin-bottom: 20px; 
    padding: 15px; 
    border: 2px solid #ccc; 
    border-radius: 8px;
    background-color: #f9f9f9; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
    transition: border-color 0.3s, box-shadow 0.3s; 
  }

  .display:focus {
    outline: none; 
    border-color: #66afe9; 
    box-shadow: 0 0 5px rgba(102, 175, 233, 0.6)
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
  }

  button {
    width: 80px;
    height: 80px;
    font-size: 30px;
    cursor: pointer;
    display: flex; 
    justify-content: center; 
    align-items: center; 
    background-color: #f0f0f0;
    border: none;
    border-radius: 8px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  button:active {
    transform: translateY(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  </style>