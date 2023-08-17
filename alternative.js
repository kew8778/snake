'use strict';

// DOM:
// - поле canvas
const canvas = document.querySelector('.ctx');
const ctx = canvas.getContext('2d');

// - кнопка старт/пауза
const btn = document.querySelector('.btn');

// - кнопки направления
const up = document.querySelector('.up');
const down = document.querySelector('.down');
const left = document.querySelector('.left');
const right = document.querySelector('.right');


// Переменные
let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
let columns = 25; // кол-во столбцов
let rows = 25; // кол-во рядов
let squares = columns * rows; // 625
let widthSquares = widthCanvas / columns;

let arrSquares = []; // массив всех квадратов с координатами и метками

let snake = [[12, 22], [12, 23]]; // квадраты начальной змеи (нумерация с 0)
let colorSnake = 'black'; // цвет змеи
let directionSnake = 'up'; // направление змеи
let speedSnake; // скорость змеи

let bariers = []; // квадраты барьеров

let colorFood = 'blue'; // цвет еды

let level = 0; // текущий уровень
let needToEat; // нужно съесть

const levels = [
    {speed: 500, foods: 5},
    {speed: 400, foods: 7},
    {speed: 320, foods: 9},
    {speed: 256, foods: 11},
    {speed: 205, foods: 13},
    {speed: 164, foods: 15},
    {speed: 131, foods: 17},
    {speed: 105, foods: 19},
]; // уровни игры

// Управление
btn.addEventListener('click', start);

function start() {
    loadLevel(level);

    btn.removeEventListener('click', start);
    btn.textContent = 'Pause';
    btn.addEventListener('click', pause);
    
    outputFood();
    startPlay();
}

function pause() {
    clearInterval(timerId);
    document.removeEventListener('keydown', activeArrows);
    btn.removeEventListener('click', pause);
    btn.textContent = 'Continue';
    btn.addEventListener('click', continuePlay);
}

function continuePlay() {
    startPlay();
    btn.removeEventListener('click', continuePlay);
    btn.textContent = 'Pause';
    btn.addEventListener('click', pause);
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
    fillArrSquares(); // заполняем массив с данными квадратов
    outputSnake(); // выводим змею
    outputBariers(); // выводим барьеры
    speedSnake = levels[level].speed;
    needToEat = levels[level].foods;
}

function reset() {
    ctx.clearRect(0, 0, widthCanvas, heightCanvas);
    arrSquares = [];
    snake = [[12, 22], [12, 23]];
    directionSnake = 'up';
    bariers = [];
}

function fillArrSquares() {   
    for (let i = 0; i < columns; i++) {
        let column = [];

        for (let j = 0; j < rows; j++) {
            let square = {};

            square.coordinate = [i * widthSquares, j * widthSquares];
            square.mark = 'free';

            column.push(square);
        }

        arrSquares.push(column);
    }
}

function outputSnake() {
    const lengthSnake = snake.length;
    ctx.fillStyle = colorSnake;

    for (let i = 0; i < lengthSnake; i++) {
        fillSquare(...snake[i], 'snake');
    }
}

function fillSquare(x, y, mark) {
    ctx.fillRect(...arrSquares[x][y].coordinate, widthSquares, widthSquares);
    arrSquares[x][y].mark = mark;
}

function outputBariers() {
    if (bariers.length === 0) {
        return;
    }
}

// Игра
loadLevel(level);
let timerId;

function startPlay() {
    timerId = setInterval( () => {
        goSnake();
        document.addEventListener('keydown', activeArrows); // активируем навигацию
    }, speedSnake);
}

function outputFood() {
    const numFree = squares - snake.length - bariers.length; // число свободных квадратов

    const randomSquare = Math.floor(Math.random() * (numFree)) + 1;

    let num = 0;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (arrSquares[i][j].mark === 'free') {
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

    let markSquare = arrSquares[nextSquere[0]][nextSquere[1]].mark;
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
        fillSquare(...nextSquere, 'snake');

        needToEat--;

        if (needToEat === 0) {
            return finish();
        } else {
            return outputFood();
        }
    }

    if (markSquare === 'free' || isLastSquare) {
        removeSquare(...lastSquare);
        snake.pop();

        ctx.fillStyle = colorSnake;
        fillSquare(...nextSquere, 'snake');
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
    ctx.clearRect(...arrSquares[x][y].coordinate, widthSquares, widthSquares);
    arrSquares[x][y].mark = 'free';
}

function gameOver() {
    clearInterval(timerId);

    ctx.font = '70px Verdana';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('Конец игры', 250, 250);

    btn.removeEventListener('click', pause);
    btn.textContent = 'Start';
    btn.addEventListener('click', start);
    
    document.removeEventListener('keydown', activeArrows);
}

function finish() {
    clearInterval(timerId);
    document.removeEventListener('keydown', activeArrows);

    ctx.font = '70px Verdana';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
    ctx.fillText('Уровень', 250, 200);
    ctx.fillText('пройден', 250, 300);

    if (level < levels.length - 1) {
        level++;
    }

    btn.removeEventListener('click', pause);
    btn.textContent = 'Start';
    btn.addEventListener('click', start);
}
