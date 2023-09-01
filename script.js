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
let totalSquares = columns * rows;
let widthSquare = widthCanvas / columns;

let squares = []; // матрица поля с метками

let initSnake = [[12, 22], [12, 23]]; // квадраты начальной змеи
let headSnake; // квадрат головы змеи
let tailSnake; // квадрат хвоста змеи
let lengthSnake;
let colorSnake = 'black'; // цвет змеи
let directionSnake; // направление змеи
let speedSnake; // скорость змеи

let bariers = []; // квадраты барьеров
let lengthBariers = bariers.length;

let colorFood = 'blue'; // цвет еды

let level = 0; // текущий уровень
let needToEat; // нужно съесть

const levels = [
    {speed: 300, foods: 50},
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
    resetSquares();
    outputSnake(); // выводим змею
    outputBariers(); // выводим барьеры
    speedSnake = levels[level].speed;
    needToEat = levels[level].foods;
}

function initSquares() {   
    for (let i = 0; i < columns; i++) {
        let column = new Array(rows).fill('free');

        squares.push(column);
    }
}

function resetSquares() {
    ctx.clearRect(0, 0, widthCanvas, heightCanvas);

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            squares[i][j] = 'free';
        }
    }
}

function outputSnake() {
    lengthSnake = initSnake.length;
    directionSnake = 'up';
    headSnake = initSnake[0];
    tailSnake = initSnake.at(-1);

    ctx.fillStyle = colorSnake;

    for (let i = 0; i < lengthSnake; i++) {
        fillSquare(initSnake[i][0], initSnake[i][1], directionSnake);
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
    const numFree = totalSquares - lengthSnake - lengthBariers; // число свободных квадратов

    const randomSquare = Math.floor(Math.random() * (numFree)) + 1;

    let num = 0;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (squares[i][j] === 'free') {
                num++;

                if (num === randomSquare) {
                    ctx.fillStyle = colorFood;
                    fillSquare(i, j, 'food');
                    return;
                }
            }
        }
    }
}

function goSnake() {  // доработать *******************
    let nextSquere = getNextSquare();

    if ( !(nextSquere) ) {
        return gameOver();
    }

    let markNextSquare = squares[nextSquere[0]][nextSquere[1]];
    let isLastSquare = tailSnake[0] === nextSquere[0] && tailSnake[1] === nextSquere[1];

    if (markNextSquare !== 'food' && markNextSquare !== 'free' && !(isLastSquare)) {
        return gameOver();
    }

    if (markNextSquare === 'food') {
        ctx.fillStyle = colorSnake;
        fillSquare(nextSquere[0], nextSquere[1], 'head');
        squares[headSnake[0]][headSnake[1]] = directionSnake;
        headSnake = nextSquere;

        needToEat--;
        lengthSnake++;

        if (needToEat === 0) {
            return finish();
        } else {
            return outputFood();
        }
    }

    if (markNextSquare === 'free' || isLastSquare) {
        let nextTailSnake = getTailSnake();
        removeSquare(tailSnake[0], tailSnake[1]);
        tailSnake = nextTailSnake;

        ctx.fillStyle = colorSnake;
        fillSquare(nextSquere[0], nextSquere[1], 'head');
        squares[headSnake[0]][headSnake[1]] = directionSnake;
        headSnake = nextSquere;
    }
}

function getNextSquare() {
    let x = headSnake[0];
    let y = headSnake[1];

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

function getTailSnake() {
    let x = tailSnake[0];
    let y = tailSnake[1];
    let direction = squares[x][y];

    if (direction === 'up') {
        return [x, y - 1];
    }
    
    if (direction === 'down') {
        return [x, y + 1];
    }
    
    if (direction === 'left') {
        return [x - 1, y];
    }
    
    if (direction === 'rigth') {
        return [x + 1, y];
    }
}

function gameOver() {
    clearInterval(timerId);

    ctx.font = widthSquare * 3 + 'px Verdana';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('Конец игры', widthCanvas / 2, heightCanvas / 2);

    btn.removeEventListener('click', pause);
    btn.textContent = 'Start';
    btn.addEventListener('click', start);
    
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

    btn.removeEventListener('click', pause);
    btn.textContent = 'Start';
    btn.addEventListener('click', start);
}
