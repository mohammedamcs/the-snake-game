import { canvas, ctx, playAudio,score } from "./index.js";
// Globals
const SEGMENT_SIZE = 20;
const SNAKE_COLOR = "#7DCE13";
const MOLT_LIMIT = 450;

const FRUITS = [
  { name: "cherries", moltRate: 6 },
  { name: "apple", moltRate: 2 },
  { name: "grapes", moltRate: 3 },
];

let snakeBody = [
  { x: 100 - SEGMENT_SIZE, y: 200 - SEGMENT_SIZE },
  { x: 100 - SEGMENT_SIZE, y: 200 },
  { x: 100 - SEGMENT_SIZE * 2, y: 200 },
  { x: 100 - SEGMENT_SIZE * 3, y: 200 },
];

let nextSnakeHeadPosition = { vx: 0, vy: 0 };
let snakeFoodPosition = { x: SEGMENT_SIZE, y: SEGMENT_SIZE };
let isPlayerMadeTheMove = false;
let currentFood = FRUITS[Math.floor(Math.random() * FRUITS.length)];

// Event Listeners
document.addEventListener("keydown", move);

function update() {
  if (isPlayerMadeTheMove) {
    // update snake head position and whole body
    updateSnake();
    // Check if snake is on food to molt or not
    if (isSnakeOnFood()) {
      moltSnake();
      generateRandomPosForFood();
      // Generate Random Food
      currentFood = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    }
  }
}

function draw() {
  drawSnake();
  drawFood();
}

function updateSnake() {
  // Update from tail to head, since head will get a new position
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = { ...snakeBody[i - 1] };
  }

  // New Position For Head
  snakeBody[0].x += nextSnakeHeadPosition.vx;
  snakeBody[0].y += nextSnakeHeadPosition.vy;

  // Update Score
  score.innerHTML = snakeBody.length;
}

function drawSnake() {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.strokeStyle = "black";
  for (let segment of snakeBody) {
    ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
    ctx.strokeRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
  }
}

function drawFood() {
  const foodImage = document.getElementById(`${currentFood.name}`);

  ctx.drawImage(
    foodImage,
    snakeFoodPosition.x,
    snakeFoodPosition.y,
    SEGMENT_SIZE,
    SEGMENT_SIZE
  );
}

function isSnakeOnFood() {
  return snakeBody.some(
    (segment) =>
      segment.x === snakeFoodPosition.x && segment.y === snakeFoodPosition.y
  );
}

function moltSnake() {
  // Sound effect for eating
  playAudio("eat");

  // Increase the size of the snake
  for (let i = 0; i < currentFood.moltRate; i++) {
    snakeBody.push(snakeBody[snakeBody.length - 1]);
  }
}

function generateRandomPosForFood() {
  // New Random Food Position
  let newFoodPos;
  let stayInLoop = true;

  const xLimit = canvas.width - SEGMENT_SIZE;
  const yLimit = canvas.height - SEGMENT_SIZE;
  const size = SEGMENT_SIZE;

  while (stayInLoop) {
    const foodX = Math.floor((Math.random() * xLimit) / size) * size;
    const foodY = Math.floor((Math.random() * yLimit) / size) * size;

    newFoodPos = { x: foodX, y: foodY };

    if (!isNewFoodOnSnake(newFoodPos)) {
      stayInLoop = false;
    }
  }

  // Update snake food position
  snakeFoodPosition = newFoodPos;
}

function isNewFoodOnSnake(newFoodPos) {
  return snakeBody.some(
    (seg) => seg.x === newFoodPos.x && seg.y === newFoodPos.y
  );
}

function move(e) {
  switch (e.keyCode) {
    case 37:
      // Right Arrow
      if (nextSnakeHeadPosition.vx === SEGMENT_SIZE) return;
      nextSnakeHeadPosition = { vx: -SEGMENT_SIZE, vy: 0 };
      isPlayerMadeTheMove = true;
      break;

    case 39:
      // Left Arrow
      if (nextSnakeHeadPosition.vx === -SEGMENT_SIZE) return;
      nextSnakeHeadPosition = { vx: SEGMENT_SIZE, vy: 0 };
      isPlayerMadeTheMove = true;
      break;

    case 38:
      // Up Arrow
      if (nextSnakeHeadPosition.vy === SEGMENT_SIZE) return;
      nextSnakeHeadPosition = { vx: 0, vy: -SEGMENT_SIZE };
      isPlayerMadeTheMove = true;
      break;

    case 40:
      // Down Arrow
      // At the beginning of the game prevent player from going down because otherwise snake will eat it self, due to the starting shape of the snake.
      if (isPlayerMadeTheMove) {
        if (nextSnakeHeadPosition.vy === -SEGMENT_SIZE) return;
        nextSnakeHeadPosition = { vx: 0, vy: SEGMENT_SIZE };
      }
      break;
  }
}

function isSnakeAlive() {
  let isAlive = !isHeadSmashedIntoWall() && !isSnakeAteItSelf();

  return isAlive;
}

function isHeadSmashedIntoWall() {
  const head = snakeBody[0];
  let isSmashed = false;

  // left wall
  if (head.x < 0) {
    isSmashed = true;
  }

  // right wall
  if (head.x > canvas.width - SEGMENT_SIZE) {
    isSmashed = true;
  }

  // top wall
  if (head.y < 0) {
    isSmashed = true;
  }

  if (head.y > canvas.height - SEGMENT_SIZE) {
    isSmashed = true;
  }

  return isSmashed;
}

function isSnakeAteItSelf() {
  let isAteItSelf = false;
  const head = snakeBody[0];
  for (let segment of snakeBody.slice(1)) {
    if (head.x === segment.x && head.y === segment.y) {
      isAteItSelf = true;
      // visual indicator for where snake eat it self
      ctx.clearRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
      ctx.fillStyle = "red";
      ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
      ctx.strokeRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
    }
  }
  return isAteItSelf;
}

function resetSnake() {
  snakeBody = [
    { x: 100 - SEGMENT_SIZE, y: 200 - SEGMENT_SIZE },
    { x: 100 - SEGMENT_SIZE, y: 200 },
    { x: 100 - SEGMENT_SIZE * 2, y: 200 },
    { x: 100 - SEGMENT_SIZE * 3, y: 200 },
  ];
  nextSnakeHeadPosition = { vx: 0, vy: 0 };
  snakeFoodPosition = { x: SEGMENT_SIZE, y: SEGMENT_SIZE };
  isPlayerMadeTheMove = false;
}

function isPlayerWon(){
  return snakeBody.length >= MOLT_LIMIT;
}

const Snake = {
  update,
  draw,
  isSnakeAlive,
  resetSnake,
  isPlayerWon
};

export default Snake;
