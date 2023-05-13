'use strict';

const ctx = document.querySelector('.ctx').getContext('2d');
const btn = document.querySelector('button');

let snake;
let timerId;
let directionSnake;
let food;

reset();

btn.addEventListener('click', start);

function start() {
    reset();

    btn.removeEventListener('click', start);
               
    timerId = setInterval( () => {
        directionSnake();
        document.addEventListener('keydown', activeArrows);
    }, 300);

    createFood();
}

function up() {
    snake.unshift([snake[0][0], snake[0][1] - 20]);
                
    if (snake[0][1] < 0 || isSnake()) {
        gameOver();
        return;
    }

    move();
}

function down() {
    snake.unshift([snake[0][0], snake[0][1] + 20]);
                
    if (snake[0][1] > 480 || isSnake()) {
        gameOver();
        return;
    }

        move();
}

function left() {
    snake.unshift([snake[0][0] - 20, snake[0][1]]);
                
    if (snake[0][0] < 0 || isSnake()) {
        gameOver();
        return;
    }

    move();
}

function rigth() {
    snake.unshift([snake[0][0] + 20, snake[0][1]]);
                
    if (snake[0][0] > 480 || isSnake()) {
        gameOver();
        return;
    }

    move();
}

function gameOver() {
    clearInterval(timerId);

    ctx.font = '70px Verdana';
    ctx.fillStyle = 'red';
    ctx.fillText('Конец игры', 40, 250);

    btn.addEventListener('click', start);
    document.removeEventListener('keydown', activeArrows);
}

function move() {
    if (food[0] !== snake[0][0] || food[1] !== snake[0][1]) {
        ctx.fillRect(snake[0][0], snake[0][1], 20, 20);

        const lengthSnake = snake.length;
        ctx.clearRect(snake[lengthSnake - 1][0], snake[lengthSnake - 1][1], 20, 20);
        snake.pop();
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
    ctx.fillRect(240, 440, 20, 40);
    directionSnake = up;
    snake = [
        [240, 440],
        [240, 460],
    ];
}

function createFood() {
	const randomX = Math.floor(Math.random() * 25) * 20;
    const randomY = Math.floor(Math.random() * 25) * 20;

    let isThere = false;

    for (let square of snake) {
        if (square[0] === randomX && square[1] === randomY) {
            createFood();
        }
    }

    if (isThere === false) {
        food = [randomX, randomY];
        ctx.fillRect(food[0], food[1], 20, 20);
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
