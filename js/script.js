document.addEventListener('DOMContentLoaded', function () {
    const ticTacToeContainer = document.getElementById('ticTacToe');
    const omokContainer = document.getElementById('omok');
    const baseballContainer = document.getElementById('baseball');

    const ticTacToeButton = document.getElementById('ticTacToeButton');
    const omokButton = document.getElementById('omokButton');
    const baseballButton = document.getElementById('baseballButton');

    const gridItems = document.querySelectorAll('.grid-item');
    const resetButton = document.getElementById('resetButton');
    let currentPlayer = 'X';

    // Function to display the selected game container
    function showGame(game) {
        // Hide all game containers
        ticTacToeContainer.style.display = 'none';
        omokContainer.style.display = 'none';
        baseballContainer.style.display = 'none';

        // Show the selected game
        if (game === 'ticTacToe') {
            ticTacToeContainer.style.display = 'block';
        } else if (game === 'omok') {
            omokContainer.style.display = 'block';
        } else if (game === 'baseball') {
            baseballContainer.style.display = 'block';
        }
    }

    // Function to update the selected game button
    function selectGameButton(buttonId) {
        // Remove 'selected' class from all buttons
        ticTacToeButton.classList.remove('selected');
        omokButton.classList.remove('selected');
        baseballButton.classList.remove('selected');

        // Add 'selected' class to the clicked button
        document.getElementById(buttonId).classList.add('selected');
    }

    // Event listeners for game selection buttons
    ticTacToeButton.addEventListener('click', () => {
        selectGameButton('ticTacToeButton');
        showGame('ticTacToe');
    });

    omokButton.addEventListener('click', () => {
        selectGameButton('omokButton');
        showGame('omok');
    });

    baseballButton.addEventListener('click', () => {
        selectGameButton('baseballButton');
        showGame('baseball');
    });

    // Tic Tac Toe game logic
    gridItems.forEach(item => {
        item.addEventListener('click', function () {
            if (item.textContent !== '') return;
            item.textContent = currentPlayer;
            item.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        });
    });

    // Reset Tic Tac Toe game
    resetButton.addEventListener('click', function () {
        gridItems.forEach(item => {
            item.textContent = '';
            item.classList.remove('playerX', 'playerO');
        });
        currentPlayer = 'X';
    });

    // Show Tic Tac Toe by default on page load
    selectGameButton('ticTacToeButton');
    showGame('ticTacToe');

    // Baseball game logic
    const MAX_TRIES = 10;
    let answer = [];
    let attemptCount = 0;

    // Generate a random 3-digit answer
    function getRandomNumber() {
        answer = [];
        while (answer.length < 3) {
            let randomDigit = Math.floor(Math.random() * 9) + 1;
            if (!answer.includes(randomDigit)) {
                answer.push(randomDigit);
            }
        }
        console.log("Answer generated (hidden):", answer);
    }

    // Function to display messages in the game area
    function logMessage(message) {
        const resultDiv = document.getElementById('result');
        const newMessage = document.createElement('p');
        newMessage.textContent = message;
        resultDiv.appendChild(newMessage);
    }

    // Function to start a new game
    function startBaseballGame() {
        attemptCount = 0;
        document.getElementById('result').innerHTML = ''; // Clear previous messages
        logMessage(`Game Started! You have a maximum of ${MAX_TRIES} attempts.`);
        getRandomNumber();
    }

    // Function to check the player's guess
    function checkGuess(guess) {
        if (guess.length !== 3 || new Set(guess).size !== 3) {
            logMessage("Please enter three unique digits between 1 and 9.");
            return;
        }

        let strike = 0;
        let ball = 0;

        // Count strikes and balls
        for (let i = 0; i < 3; i++) {
            if (guess[i] === answer[i]) {
                strike++;
            } else if (answer.includes(guess[i])) {
                ball++;
            }
        }

        attemptCount++;
        if (strike === 3) {
            logMessage(`Congratulations! You won in ${attemptCount} tries! The answer was ${answer.join("")}.`);
            return;
        }

        if (attemptCount >= MAX_TRIES) {
            logMessage(`Game over! You've reached ${MAX_TRIES} attempts. The answer was ${answer.join("")}.`);
        } else {
            logMessage(`Attempt ${attemptCount}: ${strike} Strike(s), ${ball} Ball(s)`);
        }
    }

    // Event listener for user input
    document.getElementById('submitGuess').addEventListener('click', () => {
        const userGuess = document.getElementById('guessInput').value;
        const guessArray = Array.from(userGuess).map(Number);
        checkGuess(guessArray);
    });

    // Event listener to reset the game
    document.getElementById('resetBaseballGame').addEventListener('click', startBaseballGame);

    // Start the Baseball game on page load
    startBaseballGame();
});
