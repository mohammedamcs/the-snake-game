import Snake from "./snake.js";

// Queries
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
const heading = document.querySelector("header h1");
const restartBtn = document.getElementById("restartBtn");
export const score = document.querySelector(".score");

// Globals
const FBS = 8;

// Event Listeners
restartBtn.addEventListener("click", resetGame);

function update() {
  // Clear Previous Frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update Snake
  Snake.update();

  // Draw new update for snake
  Snake.draw();

  // Check if snake is still alive
  if (!Snake.isSnakeAlive()) {
    gameOver();
    return;
  }

  // Check if player won
  if(Snake.isPlayerWon()){
    playerWon();
    return;
  }

  setTimeout(() => {
    requestAnimationFrame(update);
  }, 1000 / FBS);
}

function gameOver() {
  // Play game over sound effect
  playAudio("fail");

  // Change canvas background
  canvas.classList.add("game-over");

  // Change Heading
  heading.innerHTML = "Game Over";
  heading.classList.add("game-over");
  setTimeout(() => {
    canvas.classList.remove("game-over");
    restartBtn.style.display = "initial";
  }, 1000);
}

function playerWon() {
  // Play game over sound effect
  playAudio("success");

  // Change canvas background
  canvas.classList.add("player-won");

  // Change Heading
  heading.innerHTML = "Great Job!";
  heading.classList.add("player-won");
  setTimeout(() => {
    canvas.classList.remove("player-won");
    restartBtn.style.display = "initial";
  }, 1000);
}

function resetGame() {
  // Resetting snake state
  Snake.resetSnake();
  // Resetting Heading
  heading.innerHTML = "The Snake";
  heading.classList.remove("game-over");
  // Hiding restartBtn
  restartBtn.style.display = "none";
  // Resetting score
  score.innerHTML = 0;
  // Re-run the game
  update();
}

export function playAudio(fileName) {
  const audio = new Audio(`../sounds/${fileName}.mp3`);
  audio.play();
}

window.addEventListener("DOMContentLoaded", update);
