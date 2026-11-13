"use strict";

const BOARD_SIZE = 30;
const INITIAL_SPEED = 125;
const POISON_LIFETIME = 8000;
const HIGH_SCORE_KEY = "snake-high-score";
const THEME_KEY = "snake-theme";

const playBoard = document.querySelector(".play-board");
const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".high-score");
const messageEl = document.querySelector("#gameMessage");
const messageTitleEl = document.querySelector("#messageTitle");
const messageTextEl = document.querySelector("#messageText");
const resetBtn = document.querySelector("#resetBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const themeBtn = document.querySelector("#themeBtn");
const levelButtons = [...document.querySelectorAll(".level-button")];
const directionButtons = document.querySelectorAll(".direction-button");

let snake;
let food;
let poison;
let score;
let highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
let speed = INITIAL_SPEED;
let velocity = { x: 0, y: 0 };
let gameStarted = false;
let gameOver = false;
let paused = false;
let gameTimer = null;
let poisonTimer = null;

playBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
playBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
highScoreEl.textContent = highScore;

function applyTheme(theme) {
    const light = theme === "light";
    document.body.classList.toggle("light", light);
    themeBtn.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} theme`);
    themeBtn.innerHTML = `<span aria-hidden="true">${light ? "☾" : "☼"}</span>`;
}

applyTheme(localStorage.getItem(THEME_KEY) || "dark");

themeBtn.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
});

function isOccupied(x, y) {
    return snake.some((segment) => segment.x === x && segment.y === y)
        || (food && food.x === x && food.y === y)
        || (poison && poison.x === x && poison.y === y);
}

function randomFreeCell() {
    const available = [];
    for (let y = 1; y <= BOARD_SIZE; y += 1) {
        for (let x = 1; x <= BOARD_SIZE; x += 1) {
            if (!isOccupied(x, y)) available.push({ x, y });
        }
    }
    return available.length ? available[Math.floor(Math.random() * available.length)] : null;
}

function showMessage(title, text, visible = true) {
    messageTitleEl.textContent = title;
    messageTextEl.textContent = text;
    messageEl.classList.toggle("visible", visible);
}

function draw() {
    const pieces = [];
    if (food) {
        pieces.push(`<span class="food-piece" style="grid-area:${food.y}/${food.x}" aria-hidden="true"></span>`);
    }
    if (poison) {
        pieces.push(`<span class="poison-piece" style="grid-area:${poison.y}/${poison.x}" aria-hidden="true"></span>`);
    }
    snake.forEach((segment, index) => {
        pieces.push(
            `<span class="snake-piece${index === 0 ? " snake-head" : ""}" style="grid-area:${segment.y}/${segment.x}" aria-hidden="true"></span>`
        );
    });
    playBoard.innerHTML = pieces.join("");
}

function stopGameTimer() {
    if (gameTimer !== null) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function startGameTimer() {
    stopGameTimer();
    gameTimer = setInterval(step, speed);
}

function clearPoison() {
    if (poisonTimer !== null) {
        clearTimeout(poisonTimer);
        poisonTimer = null;
    }
    poison = null;
}

function spawnPoison() {
    if (poison) return;
    poison = randomFreeCell();
    if (!poison) return;

    poisonTimer = setTimeout(() => {
        poison = null;
        poisonTimer = null;
        draw();
    }, POISON_LIFETIME);
}

function endGame(won = false) {
    gameOver = true;
    stopGameTimer();
    clearPoison();
    showMessage(won ? "Board cleared!" : "Game over", won ? `You scored ${score} points.` : `Final score: ${score}.`);
    pauseBtn.disabled = true;
}

function updateScore() {
    scoreEl.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
        localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
    }
}

function step() {
    if (!gameStarted || paused || gameOver) return;

    const head = snake[0];
    const nextHead = { x: head.x + velocity.x, y: head.y + velocity.y };

    if (
        nextHead.x < 1 || nextHead.x > BOARD_SIZE
        || nextHead.y < 1 || nextHead.y > BOARD_SIZE
    ) {
        endGame();
        return;
    }
    if (poison && nextHead.x === poison.x && nextHead.y === poison.y) {
        endGame();
        return;
    }

    const ateFood = food && nextHead.x === food.x && nextHead.y === food.y;
    const bodyToCheck = ateFood ? snake : snake.slice(0, -1);
    if (bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
        endGame();
        return;
    }

    snake.unshift(nextHead);
    if (ateFood) {
        score += 1;
        updateScore();
        food = null;
        food = randomFreeCell();
        if (!food) {
            draw();
            endGame(true);
            return;
        }
        if (!poison && Math.random() < 0.3) spawnPoison();
    } else {
        snake.pop();
    }
    draw();
}

function setDirection(key) {
    if (paused || gameOver) return;

    const directions = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 }
    };
    const nextVelocity = directions[key];
    if (!nextVelocity || (nextVelocity.x === -velocity.x && nextVelocity.y === -velocity.y)) return;

    velocity = nextVelocity;
    if (!gameStarted) {
        gameStarted = true;
        showMessage("", "", false);
        startGameTimer();
    }
}

function resetGame() {
    stopGameTimer();
    clearPoison();
    snake = [
        { x: 15, y: 15 },
        { x: 14, y: 15 },
        { x: 13, y: 15 }
    ];
    food = null;
    score = 0;
    velocity = { x: 0, y: 0 };
    gameStarted = false;
    gameOver = false;
    paused = false;
    pauseBtn.disabled = false;
    pauseBtn.textContent = "Pause";
    pauseBtn.setAttribute("aria-pressed", "false");
    scoreEl.textContent = "0";
    food = randomFreeCell();
    showMessage("Ready to play?", "Use the arrow keys or tap a direction to start.");
    draw();
}

document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        event.preventDefault();
    }
    setDirection(key);
});

directionButtons.forEach((button) => {
    button.addEventListener("click", () => setDirection(button.dataset.direction));
});

playBoard.addEventListener("pointerdown", (event) => {
    playBoard.dataset.touchX = String(event.clientX);
    playBoard.dataset.touchY = String(event.clientY);
});

playBoard.addEventListener("pointerup", (event) => {
    const startX = Number(playBoard.dataset.touchX);
    const startY = Number(playBoard.dataset.touchY);
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 20) return;
    setDirection(Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? "ArrowRight" : "ArrowLeft")
        : (deltaY > 0 ? "ArrowDown" : "ArrowUp"));
});

levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
        speed = Number(button.dataset.speed);
        levelButtons.forEach((levelButton) => {
            const active = levelButton === button;
            levelButton.classList.toggle("active", active);
            levelButton.setAttribute("aria-pressed", String(active));
        });
        if (gameStarted && !paused && !gameOver) startGameTimer();
    });
});

pauseBtn.addEventListener("click", () => {
    if (!gameStarted || gameOver) return;
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
    pauseBtn.setAttribute("aria-pressed", String(paused));
    if (paused) {
        stopGameTimer();
        showMessage("Game paused", "Take a breather. Resume when you’re ready.");
    } else {
        showMessage("", "", false);
        startGameTimer();
    }
});

resetBtn.addEventListener("click", resetGame);
resetGame();
