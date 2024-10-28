//Define HTML elemnts
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const gameOverText = document.getElementById("game-over-text");

//define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }]; //boyut değişlecek, arrayin içindeki position obj //pozisyonu için
let food = generateFood(); //sabit olmaması için bir fonksiyon
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

///draw game map,snake,food
function draw() {
  board.innerHTML = ""; //draw fonksiyonu her çalıştığında board yeniden başlatılacak
  drawSnake();
  drawFood();
  updateScore();
}

//draw snake
function drawSnake() {
  if (gameStarted) {
    snake.forEach((segment) => {
      const snakeElement = createGameElement("div", "snake"); //resp for create snake element and snake class
      setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    });
  }
}

//create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//set the position of the snake or food

function setPosition(element, position) {
  element.style.gridColumn = position.x; //position--segment--segmen x //yatay
  element.style.gridRow = position.y; //dikey
}
//testing draw function
//draw();

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

//food pozisyonunun değişmesi işlemi için rastgele x,y değerleri
function generateFood() {
  //0'dan büyük olması için +1, tam sayı olması için floor
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

//moving the snake
function move() {
  const head = { ...snake[0] }; ////copy of snake
  switch (direction) {
    case "up":
      head.y--; //up'a bastığında y bir azalacak
      break;
    case "down":
      head.y++; //down'a bastığında y bir artacak
      break;
    case "right":
      head.x++; //right'a bastığında x bir artacak
      break;
    case "left":
      head.x--; //left bastığında x bir azalacak
      break;

    default:
      break;
  }
  snake.unshift(head); //unshift snakein başına head ekler,adding new part to snake

  //snake.pop(); //removes last element

  if (head.x === food.x && head.y === food.y) {
    //eğer food ve head kordinatları eşitle
    food = generateFood(); //yeni lokasyona geçer
    increaseSpeed();
    clearInterval(gameInterval); // cleas past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}
//test moving
//setInterval(() => {
//move(); //move first
//draw(); //then draw again a new position
//}, 200);

//start game function
//oyun başlatıldığında logo ve text saklanacak
function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

//keypress eventlistener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      default:
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  //  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
  showGameOver();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0"); /// 3 haneli bir score yapmak için
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

function showGameOver() {
  instructionText.style.display = "none";
  gameOverText.style.display = "block";
  logo.style.display = "none";

  setTimeout(() => {
    gameOverText.style.display = "none";
    instructionText.style.display = "block";
    logo.style.display = "block";
  }, 4000);
}
