<template>
  <div class="CalculatorLogic" :class="{ dark: isDarkmode }">
    <input type="text" v-model="display" readonly class="display"/>

    <canvas 
      ref="displayCanvas" 
      class="canvas" 
      @mousedown="startDrawing" 
      @mousemove="draw" 
      @mouseup="stopDrawing"
    ></canvas>

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
  import * as ort from 'onnxruntime-web';
  
  export default {
    name: 'CalculatorLogic',
    setup() {
      const display = ref('');
      const isDrawing = ref(false);
      const soundEnabled = ref(false);
      const displayCanvas = ref(null); 
      const context = ref(null);
      const isDarkmode = ref(false)

      const drawingPath = [];
      const onnxModel = ref(null);
      const isVisible = ref(false); 
      const displayCanvasRef = ref(null)
      //buttons
      const buttonArray = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', 'AC', '0', '=', '/', '.', '√'];
      //load Coin's Voice
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
        };

        onMounted(async () => {
          try {
            onnxModel.value = await ort.InferenceSession.create('./public/mnist-12-int8.onnx', {
              backendHint: 'wasm', 
            });
            console.log('Model loaded successfully:', onnxModel.value);
          } catch (error) {
            console.error('Error loading model:', error);
          }
          
          const canvas = displayCanvas.value; 
          context.value = canvas.getContext('2d');
          if (!context.value) {
            console.error('Failed to get canvas context');
          } else {
            canvas.width = 400; 
            canvas.height = 150; 
          }
        });

        function startDrawing(event) {
          isDrawing.value = true;
          const ctx = context.value;
          ctx.beginPath();
          ctx.moveTo(event.offsetX, event.offsetY);
        }

        function draw(event) {
          if (!isDrawing.value) return;
          const ctx = context.value;
          ctx.lineTo(event.offsetX, event.offsetY);
          ctx.stroke();
        }

        function stopDrawing() {
          isDrawing.value = false;
          recognizeHandwriting();
        }

        async function recognizeHandwriting() {

          onMounted(() => {
            const canvas = displayCanvasRef.value;
            context.value = canvas.getContext('2d');
            if (!context.value) {
              console.error('Failed to get canvas context');
            } else {
              canvas.width = 400;
              canvas.height = 150;
            }
          });
          const imageData = context.value.getImageData(0, 0, canvas.width, canvas.height);
          const inputTensor = preprocessImage(imageData);

          const output = await onnxModel.value.run({ input: inputTensor });

          const result = output.values().next().value;
          display.value = result; 

          context.value.clearRect(0, 0, canvas.width, canvas.height);
        }

        function preprocessImage(imageData) {
          const inputSize = 28;
          const inputData = new Float32Array(inputSize * inputSize);

          for (let y = 0; y < inputSize; y++) {
            for (let x = 0; x < inputSize; x++) {
              const index = (y * inputSize + x) * 4; 
              const grayscale = imageData.data[index]; 
              inputData[y * inputSize + x] = grayscale / 255; 
            }
          }

          return new ort.Tensor('float32', inputData, [1, 1, inputSize, inputSize]);
        }

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
      function toggleDarkMode () {
        isDarkmode.value = !isDarkmode.value; 
      };


      onMounted(()=>{
        setTimeout(()=>{
          isVisible.value = true;
        },100)
      });

      return {
        display,
        buttonArray,
        handleClick,
        toggleSound,
        isDarkmode,
        toggleDarkMode,
        startDrawing,
        draw,
        stopDrawing,
      };
    }
  }
  </script>
  
  <style>
  .CalculatorLogic {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%; 
    width: 100%;  
    background-color: var(--background-color, white);
    transition: background-color 0.3s ease; 
    overflow: hidden; 
  }

  .CalculatorLogic.dark {
    background-color: black; 
    color: white;
  }


  
  .fadeIn {
    opacity: 1; 
  }
  
  .display {
    width: 100%; 
    height: 30%;
    font-size: 40px; 
    text-align: center;
    margin-bottom: 20px; 
    padding: 15px; 
    border: none; 
    background-color: transparent; 
    color: rgb(0, 0, 0); 
    transition: box-shadow 0.3s; 
  }
  
  .display:focus {
    outline: none; 
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
  
  .canvas {
    border: 1px solid #ccc;
    width: 300px;
    height: 300px;
    margin-bottom: 20px;
  }
  
  .dark .display {
    background-color: #2a2a2a; 
    color: white; 
  }
  
  .dark button {
    background-color: #3a3a3a; 
    color: white; 
  }
  
  .dark button:hover {
    background-color: #4a4a4a;
  }
  </style>