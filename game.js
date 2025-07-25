const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 12;
const paddleHeight = 90;
const ballRadius = 10;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;

// Paddle positions
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;

// Ball position and movement
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.fillStyle = "#888";
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.fillRect(canvas.width/2 - 2, i, 4, 18);
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom wall collision
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Player paddle collision
  if (
    ballX - ballRadius < playerX + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = playerX + paddleWidth + ballRadius; // Prevent stuck
  }

  // AI paddle collision
  if (
    ballX + ballRadius > aiX &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = aiX - ballRadius; // Prevent stuck
  }

  // Score: Ball goes out of bounds
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
    resetBall();
  }

  // Simple AI: follow the ball
  const aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 15) aiY += 4;
  else if (aiCenter > ballY + 15) aiY -= 4;

  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Mouse movement controls player paddle
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - paddleHeight / 2;
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#111");

  // Net
  drawNet();

  // Player paddle
  drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
  // AI paddle
  drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");
  // Ball
  drawCircle(ballX, ballY, ballRadius, "#fff");
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();