'use strict';

const canvas = document.querySelector('.ctx');
const ctx = canvas.getContext('2d');
const btn = document.querySelector('.btn');

let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
let widthSnake = 20; // ширина змеи, поле 25 х 25 при канве 500 х 500
let snake; // массив квадратов змеи
let colorSnake = 'black'; // цвет змеи
let directionSnake; // функция направление змеи
let timerId; // запускает directionSnake
let food; // рандом квадрат еды
let colorFood = 'blue'; // цвет еды
const levels = [
    {speed: 500, foods: 5},
    {speed: 400, foods: 7},
    {speed: 320, foods: 9},
    {speed: 256, foods: 11},
    {speed: 205, foods: 13},
    {speed: 164, foods: 15},
    {speed: 131, foods: 17},
    {speed: 105, foods: 19},
]; // уровни игры, доработать
let level = 0; // уровень игры
let speedSnake; // скорость змеи
let needToEat; // нужно сожрать

reset(); // очистка поля и сброс змеи
setLevel(level); // загрузка уровня

btn.addEventListener('click', start);

function start() {
    reset();
    setLevel(level);

    btn.removeEventListener('click', start);
    btn.textContent = 'Pause';
    btn.addEventListener('click', pause);
               
    startPlay();

    createFood(); // рандом еда
}

function startPlay() {
    timerId = setInterval( () => {
        directionSnake(); // ход змеи
        document.addEventListener('keydown', activeArrows); // активируем навигацию
    }, speedSnake);
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
                
    if (snake[0][1] > heightCanvas - widthSnake || isSnake()) {
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
                
    if (snake[0][0] > widthCanvas - widthSnake || isSnake()) {
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

    btn.removeEventListener('click', pause);
    btn.textContent = 'Start';
    btn.addEventListener('click', start);
    
    document.removeEventListener('keydown', activeArrows);
}

function move() { // доделать
    if (food[0] !== snake[0][0] || food[1] !== snake[0][1]) {
        removeTail();

        ctx.fillStyle = colorSnake;
        ctx.fillRect(...snake[0], widthSnake, widthSnake);
    } else {
        ctx.fillStyle = colorSnake;
        ctx.fillRect(...snake[0], widthSnake, widthSnake);

        if (snake.length >= needToEat + 2) {
            finish();
        } else {
            createFood();
        }
    }
}

function removeTail() {
    const lengthSnake = snake.length;
    ctx.clearRect(...snake[lengthSnake - 1], widthSnake, widthSnake);
    snake.pop();
}

function activeArrows(event) { // нужно доработать )))
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
    ctx.clearRect(0, 0, widthCanvas, heightCanvas);
    directionSnake = up;

    // змейку доработать )
    snake = [ 
        [widthCanvas / 2 - widthSnake / 2, heightCanvas - widthSnake * 3],
        [widthCanvas / 2 - widthSnake / 2, heightCanvas - widthSnake * 2],
    ];
    ctx.fillStyle = colorSnake;
    ctx.fillRect(...snake[0], widthSnake, widthSnake);
    ctx.fillRect(...snake[1], widthSnake, widthSnake);
}

function createFood() { // нужно др вариант
	const randomX = Math.floor(Math.random() * 25) * widthSnake;
    const randomY = Math.floor(Math.random() * 25) * widthSnake;

    for (let square of snake) {
        if (square[0] === randomX && square[1] === randomY) {
            createFood();
            return;
        }
    }

    food = [randomX, randomY];
    ctx.fillStyle = colorFood;
    ctx.fillRect(...food, widthSnake, widthSnake);
}

function isSnake() {
    const lengthSnake = snake.length;

    for (let i = 1; i < lengthSnake - 1; i++) {
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

    if (level < levels.length - 1) {
        level++;
    }

    btn.removeEventListener('click', pause);
    btn.textContent = 'Start';
    btn.addEventListener('click', start);
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
