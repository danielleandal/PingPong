

// get the canvas
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d"); // method specific to canvas 
// ctx will allow to manipulate shapes in the canvas which is gameBoard

const scoreText = document.querySelector("#scoreText"); // gets the score text div
const resetBtn = document.querySelector("#resetBtn"); // gets the button 

// gets the properties of the canvas 
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// more propertiesa of the game
const boardBackground = "forestgreen";
const paddle1color = "lightblue";
const paddle2color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";


const ballRadius = 10; // defines the size of the ball
const paddleSpeed = 50; // the speed of the paddle moving up and down
const winningScore = 3; // Winning score

let invertalID; // a variable for the looping of the program 
let ballSpeed = 4;

// POSIION OF THE CALL, in the begining, the ball will be right in the middle 
let ballX = (gameWidth / 2);
let ballY = (gameHeight / 2);

// the ball is still 
let ballXdirection = 0;
let ballYdirection = 0;
let player1Score = 0;
let player2Score = 0;
let running = true; // Track if the game is running

// the paddle properties
let paddle1 = {
    width: 25, height: 100, x: 0, y: (gameHeight / 2) - 50 // Centering paddle vertically
};
let paddle2 = {
    width: 25, height: 100, x: gameWidth - 25, y: (gameHeight / 2) - 50// Centering paddle vertically
};

// takes the keyboard inputs
window.addEventListener("keydown", changeDirection);

// click input 
resetBtn.addEventListener("click", resetGame);

// the functions, call themselves and it all starts here
gameStart();

function gameStart() {
    createBall(); // make the ball 
    nextTick(); // THE GAMES STARTS 
}

// CONTROLLING THE FLOW OF THE GAME, by repeatedly updating the scheduling 
function nextTick() {
    if (running) { // Only update if the game is running

        // schedules the functions to run after a delay of 10 milliseconds 
        invertalID = setTimeout(() => { 
            clearBoard();
            drawPaddles();
            moveBall(); //updates the positioning dynamics
            checkCollision();
            drawBall(ballX, ballY);
            nextTick(); // recursion occurs making the function loop until running is false 
        }, 10);
    }
}

//wipes the board
function clearBoard() {
    ctx.fillStyle = boardBackground; //sets the color used for filling shapes 
    ctx.fillRect(0, 0, gameWidth, gameHeight); 
}

// makes the paddles
function drawPaddles() {
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ballSpeed = 1;
    // if math random is > 0.5 then 1 else -1 
    ballXdirection = Math.random() > 0.5 ? 1 : -1;
    ballYdirection = Math.random() > 0.5 ? 1 : -1;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;

    // draws the ball and makes it move
    drawBall(ballX, ballY);
}

function moveBall() {
    ballX += (ballSpeed * ballXdirection);
    ballY += (ballSpeed * ballYdirection);
}

function drawBall(ballX, ballY) {

    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;

    ctx.beginPath(); // begins the path of the ball 
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI); // Correct arc for a circle
    ctx.stroke();
    ctx.fill();
}

function checkCollision() {

    // if the ball hits up or down 
    if (ballY <= 0 + ballRadius || ballY >= gameHeight - ballRadius) {
        ballYdirection *= -1;
    }

    if (ballX <= 0) {
        player2Score += 1;
        updateScore();
        if (player2Score >= winningScore) {
            endGame("Player 2 Wins!");
            return;
        }
        createBall();
        return;
    }

    if (ballX >= gameWidth) {
        player1Score += 1;
        updateScore();
        if (player1Score >= winningScore) {
            endGame("Player 1 Wins!");
            return;
        }
        createBall();
        return;
    }

    if (ballX <= (paddle1.x + paddle1.width + ballRadius)) {
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballX = (paddle1.x + paddle1.width) + ballRadius;
            ballXdirection *= -1;
            ballSpeed += 0.5; // Increment ball speed by 0.5
        }
    }

    if (ballX >= (paddle2.x - ballRadius)) {
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballX = (paddle2.x - ballRadius);
            ballXdirection *= -1;
            ballSpeed += 0.5; // Increment ball speed by 0.5
        }
    }
}


    // moves the paddles
function changeDirection(event) {
    if (!running) return; // Prevent paddle movement if the game is not running

    const keyPressed = event.keyCode;
    const paddle1Up = 87; // W
    const paddle1Down = 83; // S
    const paddle2Up = 38; // Up Arrow
    const paddle2Down = 40; // Down Arrow


    switch (keyPressed) {
        case (paddle1Up):
            if (paddle1.y > 0) {
                paddle1.y -= paddleSpeed;
            }
            break;
        case (paddle1Down):
            if (paddle1.y < gameHeight - paddle1.height) {
                paddle1.y += paddleSpeed;
            }
            break;
        case (paddle2Up):
            if (paddle2.y > 0) {
                paddle2.y -= paddleSpeed;
            }
            break;
        case (paddle2Down):
            if (paddle2.y < gameHeight - paddle2.height) {
                paddle2.y += paddleSpeed;
            }
            break;
    }
}

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function endGame(message) {
    running = false; // Stop the game
    clearTimeout(invertalID); // Stop the game loop
    displayGameOver(message);
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;

    paddle1 = {
        width: 35, height: 150, x: 0, y: (gameHeight / 2) - 75
    };
    paddle2 = {
        width: 35, height: 150, x: gameWidth - 35, y: (gameHeight / 2) - 75
    };

    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXdirection = Math.random() > 0.5 ? 1 : -1;
    ballYdirection = Math.random() > 0.5 ? 1 : -1;

    updateScore();
    running = true; // Restart the game
    clearTimeout(invertalID);
    gameStart();
}

function displayGameOver(message) {
    ctx.font = "bold 50px Poppins";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2 - 50); // Centering the "GAME OVER" text
    ctx.font = "bold 30px Poppins";
    ctx.fillText(message, gameWidth / 2, gameHeight / 2 + 50); // Display the winner message
}
