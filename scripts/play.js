import { canvas, btnStart, up, down, left, right } from "./dom.js"; // DOM-элементы
import { levels } from "../data/levels.js"; // уровни игры

// Переменные
const ctx = canvas.getContext('2d');
let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
let columns = 25; // кол-во столбцов
let rows = 25; // кол-во рядов
let widthSquare = widthCanvas / columns;

let squares = []; // матрица поля с метками

let snake = [[12, 22], [12, 23]]; // квадраты начальной змеи
let colorSnake = 'black'; // цвет змеи
let directionSnake = 'up'; // направление змеи
let speedSnake; // скорость змеи

let bariers = []; // квадраты барьеров

let colorFood = 'blue'; // цвет еды

let level = 0; // текущий уровень
let needToEat; // нужно съесть

// Управление
btnStart.addEventListener('click', start);

function start() {
  loadLevel(level);

  btnStart.removeEventListener('click', start);
  btnStart.textContent = 'Pause';
  btnStart.addEventListener('click', pause);
  
  outputFood();
  startPlay();
}

function pause() {
  clearInterval(timerId);
  document.removeEventListener('keydown', activeArrows);
  btnStart.removeEventListener('click', pause);
  btnStart.textContent = 'Continue';
  btnStart.addEventListener('click', continuePlay);
}

function continuePlay() {
  startPlay();
  btnStart.removeEventListener('click', continuePlay);
  btnStart.textContent = 'Pause';
  btnStart.addEventListener('click', pause);
}

// кнопки направления змеи
// привязываем клики по кнопкам на экране к кнопкам на клаве
down.addEventListener('click', () => {
  document.dispatchEvent(
    new KeyboardEvent( 'keydown', {code: 'ArrowDown'} )
  );
});

up.addEventListener('click', () => {
  document.dispatchEvent(
    new KeyboardEvent( 'keydown', {code: 'ArrowUp'} )
  );
});

right.addEventListener('click', () => {
  document.dispatchEvent(
    new KeyboardEvent( 'keydown', {code: 'ArrowRight'} )
  );
});

left.addEventListener('click', () => {
  document.dispatchEvent(
    new KeyboardEvent( 'keydown', {code: 'ArrowLeft'} )
  );
});

// обработка кликов по кнопкам направления змеи
function activeArrows(event) { // нужно доработать )))
  if (event.code === 'ArrowDown' && directionSnake !== 'up') {
    document.removeEventListener('keydown', activeArrows);
    directionSnake = 'down';
  }

  if (event.code === 'ArrowUp' && directionSnake !== 'down') {
    document.removeEventListener('keydown', activeArrows);
    directionSnake = 'up';
  }

  if (event.code === 'ArrowRight' && directionSnake !== 'left') {
    document.removeEventListener('keydown', activeArrows);
    directionSnake = 'rigth';
  }

  if (event.code === 'ArrowLeft' && directionSnake !== 'rigth') {
    document.removeEventListener('keydown', activeArrows);
    directionSnake = 'left';
  }
}

// Загрузка
function loadLevel(level) {
  reset(); // очистка поля
  outputSnake(); // выводим змею
  outputBariers(); // выводим барьеры
  speedSnake = levels[level].speed;
  needToEat = levels[level].foods;
}

function reset() {
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
  resetSquares();
  snake = [[12, 22], [12, 23]];
  directionSnake = 'up';
  bariers = [];
}

function initSquares() {   
  for (let i = 0; i < columns; i++) {
    let column = new Array(rows).fill('free');

    squares.push(column);
  }
}

function resetSquares() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      squares[i][j] = 'free';
    }
  }
}

function outputSnake() {
  const lengthSnake = snake.length;
  ctx.fillStyle = colorSnake;

  for (let i = 0; i < lengthSnake; i++) {
    fillSquare(snake[i][0], snake[i][1], 'snake');
  }
}

function fillSquare(x, y, mark) {
  ctx.fillRect(x * widthSquare, y * widthSquare, widthSquare, widthSquare);
  
  squares[x][y] = mark;
}

function outputBariers() {
  if (bariers.length === 0) {
    return;
  }
}

// Игра
initSquares();
loadLevel(level);
let timerId;

function startPlay() {
  timerId = setInterval( () => {
    goSnake();
    document.addEventListener('keydown', activeArrows); // активируем навигацию
  }, speedSnake);
}

function outputFood() {
  const numFree = columns * rows - snake.length - bariers.length; // число свободных квадратов

  const randomSquare = Math.floor(Math.random() * (numFree)) + 1;

  let num = 0;

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (squares[i][j] === 'free') {
        num++;

        if (num === randomSquare) {
          ctx.fillStyle = colorFood;

          return fillSquare(i, j, 'food');
        }
      }
    }
  }
}

function goSnake() {
  let nextSquere = getNextSquare();

  if ( !(nextSquere) ) {
    return gameOver();
  }

  let markSquare = squares[nextSquere[0]][nextSquere[1]];
  let lastSquare = snake[snake.length - 1];
  let isLastSquare = lastSquare[0] === nextSquere[0] && lastSquare[1] === nextSquere[1];

  if (markSquare === 'barier') {
    return gameOver();
  }

  if ( (markSquare === 'snake') && !(isLastSquare) ) {
    return gameOver();
  }

  if (markSquare === 'food') {
    snake.unshift(nextSquere);

    ctx.fillStyle = colorSnake;
    fillSquare(nextSquere[0], nextSquere[1], 'snake');

    needToEat--;

    if (needToEat === 0) {
      return finish();
    } else {
      return outputFood();
    }
  }

  if (markSquare === 'free' || isLastSquare) {
    removeSquare(lastSquare[0], lastSquare[1]);
    snake.pop();

    ctx.fillStyle = colorSnake;
    fillSquare(nextSquere[0], nextSquere[1], 'snake');
    snake.unshift(nextSquere);
  }
}

function getNextSquare() {
  let x = snake[0][0];
  let y = snake[0][1];

  if (directionSnake === 'up' && y > 0) {
    return [x, y - 1];
  }
  
  if (directionSnake === 'down' && y < rows - 1) {
    return [x, y + 1];
  }
  
  if (directionSnake === 'left' && x > 0) {
    return [x - 1, y];
  }
  
  if (directionSnake === 'rigth' && x < columns - 1) {
    return [x + 1, y];
  }
}

function removeSquare(x, y) {
  ctx.clearRect(x * widthSquare, y * widthSquare, widthSquare, widthSquare);
  squares[x][y] = 'free';
}

function gameOver() {
  clearInterval(timerId);

  ctx.font = widthSquare * 3 + 'px Verdana';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'red';
  ctx.fillText('Конец игры', widthCanvas / 2, heightCanvas / 2);

  btnStart.removeEventListener('click', pause);
  btnStart.textContent = 'Start';
  btnStart.addEventListener('click', start);
  
  document.removeEventListener('keydown', activeArrows);
}

function finish() {
  clearInterval(timerId);
  document.removeEventListener('keydown', activeArrows);

  ctx.font = widthSquare * 3 + 'px Verdana';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'green';
  ctx.fillText('Уровень', widthCanvas / 2, heightCanvas / 2 - 2 * widthSquare);
  ctx.fillText('пройден', widthCanvas / 2, heightCanvas / 2 + 2 * widthSquare);

  if (level < levels.length - 1) {
    level++;
  }

  btnStart.removeEventListener('click', pause);
  btnStart.textContent = 'Start';
  btnStart.addEventListener('click', start);
}
