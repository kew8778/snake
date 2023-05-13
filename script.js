'use strict';

const canvas = document.querySelector('.ctx');
const ctx = canvas.getContext('2d');
const btn = document.querySelector('.btn');

let widthSnake = 20; // поле 25 х 25
let snake; // квадраты змеи 
let directionSnake; // функция направление змеи
let timerId; // запускает directionSnake
let food; // рандом квадрат еды
const levels = [
    {speed: 300, foods: 5},
    {speed: 250, foods: 7},
    {speed: 210, foods: 9},
    {speed: 175, foods: 11},
    {speed: 145, foods: 13},
]; // уровни игры
let level = 0; // уровень игры
let speedSnake; // скорость змеи
let needToEat; // нужно сожрать

reset();
setLevel(level);

btn.addEventListener('click', start);

function start() {
    reset();
    setLevel(level);

    btn.removeEventListener('click', start);
               
    timerId = setInterval( () => {
        directionSnake();
        document.addEventListener('keydown', activeArrows);
    }, speedSnake);

    createFood();
}

function up() {
    snake.unshift([snake[0][0], snake[0][1] - widthSnake]);
                
    if (snake[0][1] < 0 || isSnake()) {
        gameOver();
        return;
    }

    move();
}

function down() {
    snake.unshift([snake[0][0], snake[0][1] + widthSnake]);
                
    if (snake[0][1] > 480 || isSnake()) {
        gameOver();
        return;
    }

        move();
}

function left() {
    snake.unshift([snake[0][0] - widthSnake, snake[0][1]]);
                
    if (snake[0][0] < 0 || isSnake()) {
        gameOver();
        return;
    }

    move();
}

function rigth() {
    snake.unshift([snake[0][0] + widthSnake, snake[0][1]]);
                
    if (snake[0][0] > 480 || isSnake()) {
        gameOver();
        return;
    }

    move();
}

function gameOver() {
    clearInterval(timerId);

    ctx.font = '70px Verdana';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('Конец игры', 250, 250);

    btn.addEventListener('click', start);
    document.removeEventListener('keydown', activeArrows);
}

function move() {
    if (food[0] !== snake[0][0] || food[1] !== snake[0][1]) {
        ctx.fillRect(snake[0][0], snake[0][1], widthSnake, widthSnake);

        const lengthSnake = snake.length;
        ctx.clearRect(snake[lengthSnake - 1][0], snake[lengthSnake - 1][1], widthSnake, widthSnake);
        snake.pop();
    } else if (snake.length >= needToEat + 2) {
        finish();
    } else {
        createFood();
    }
}

function activeArrows(event) {
    if (event.code === 'ArrowDown' && directionSnake !== up) {
        document.removeEventListener('keydown', activeArrows);
        directionSnake = down;
    }

    if (event.code === 'ArrowUp' && directionSnake !== down) {
        document.removeEventListener('keydown', activeArrows);
        directionSnake = up;
    }

    if (event.code === 'ArrowRight' && directionSnake !== left) {
        document.removeEventListener('keydown', activeArrows);
        directionSnake = rigth;
    }

    if (event.code === 'ArrowLeft' && directionSnake !== rigth) {
        document.removeEventListener('keydown', activeArrows);
        directionSnake = left;
    }
}

function reset() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = 'black';
    directionSnake = up;
    snake = [
        [240, 440],
        [240, 460],
    ];
    ctx.fillRect(...snake[0], widthSnake, widthSnake);
    ctx.fillRect(...snake[1], widthSnake, widthSnake);
}

function createFood() {
	const randomX = Math.floor(Math.random() * 25) * widthSnake;
    const randomY = Math.floor(Math.random() * 25) * widthSnake;

    let isThere = false;

    for (let square of snake) {
        if (square[0] === randomX && square[1] === randomY) {
            createFood();
        }
    }

    if (isThere === false) {
        food = [randomX, randomY];
        ctx.fillRect(food[0], food[1], widthSnake, widthSnake);
    }
}

function isSnake() {
    const lengthSnake = snake.length;

    for (let i = 1; i < lengthSnake; i++) {
        if (snake[0][0] === snake[i][0] && snake[0][1] === snake[i][1]) {
            return true;
        }
    }

    return false;
}

function setLevel(level) {
    speedSnake = levels[level].speed;
    needToEat = levels[level].foods;
}

function finish() {
    clearInterval(timerId);
    document.removeEventListener('keydown', activeArrows);

    ctx.font = '70px Verdana';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
    ctx.fillText('Уровень', 250, 200);
    ctx.fillText('пройден', 250, 300);

    if (level < levels.length) {
        level++;
    }

    btn.addEventListener('click', start);
}
