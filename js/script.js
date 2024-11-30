document.addEventListener('DOMContentLoaded', function () {
    const ticTacToeContainer = document.getElementById('ticTacToe');
    const omokContainer = document.getElementById('omok');
    const baseballContainer = document.getElementById('baseball');

    const ticTacToeButton = document.getElementById('ticTacToeButton');
    const omokButton = document.getElementById('omokButton');
    const baseballButton = document.getElementById('baseballButton');

    // Initialize Tictactoe items
    const gridItems = document.querySelectorAll('.grid-item');
    const resetButton = document.getElementById('resetButton');
    const pvpButton = document.getElementById('pvpButton');
    const pvsButton = document.getElementById('pvsButton');
    let currentPlayer = 'X';
    let gameMode = 'PvP'; // Default mode
    let gameOver = false;
    // Winning Combinations
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Initialize Omok Grid (15x15)
    // Omok setup
    const omokGrid = document.querySelector('.omok-grid');
    let omokGridItems = [];
    let omokGameOver = false;
    const omokWinningLength = 5; // Win condition: 5 in a row

    // Initialize Omok Grid (15x15)
    function initializeOmokGrid() {
        omokGridItems = [];
        omokGrid.innerHTML = ''; // Clear existing grid
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const gridItem = document.createElement('div');
                gridItem.classList.add('omok-grid-item');
                gridItem.addEventListener('click', () => omokMove(gridItem));
                omokGrid.appendChild(gridItem);
                omokGridItems.push(gridItem);
            }
        }
    }

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

    // Function to update the selected main game button
    function selectGameButton(buttonId) {
        // Remove 'selected' class from all buttons
        ticTacToeButton.classList.remove('selected');
        omokButton.classList.remove('selected');
        baseballButton.classList.remove('selected');
        // Add 'selected' class to the clicked button
        document.getElementById(buttonId).classList.add('selected');
    }

    // Event listeners for game selection buttons for each three
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
    
    // Menu Button Event Listeners for TicTacToe
    pvpButton.addEventListener("click", () => {
        gameMode = "PvP";
        updateModeVisuals(pvpButton); // Highlight PvP as the selected mode
        resetGame();
    });
    pvsButton.addEventListener("click", () => {
        gameMode = "PvS";
        updateModeVisuals(pvsButton); // Highlight PvS as the selected mode
        resetGame();
    });

    // #1. 
    // Menu selection of TicTacToe 
    function updateModeVisuals(selectedButton) {
        // Remove 'selected' class from both buttons
        pvpButton.classList.remove('selected');
        pvsButton.classList.remove('selected');
        // Add 'selected' class to the chosen button
        selectedButton.classList.add('selected');
        // Set the color of the selected button based on game mode
        if (gameMode === "PvP") {
            pvpButton.style.backgroundColor = "darkgreen"; // Dark green for PvP
            pvsButton.style.backgroundColor = "#4CAF50"; // Reset PvS button to original color
        } else if (gameMode === "PvS") {
            pvsButton.style.backgroundColor = "darkgreen"; // Dark green for PvS
            pvpButton.style.backgroundColor = "#4CAF50"; // Reset PvP button to original color
        }
    }

    // Reset Game of TicTacToe
    resetButton.addEventListener("click", resetGame);

    // GridItem of TicTacToe
    gridItems.forEach((item) => {
        item.addEventListener('click', function () {
            if (item.textContent !== '' || gameOver) return;
            // Player move logic
            item.textContent = currentPlayer;
            item.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');
            // item.style.backgroundColor = 'darkgreen';
            if (checkWinner(currentPlayer)) {
                endGame(currentPlayer === 'X' ? 'X Wins!' : 'O Wins!');
                return;
            }
            if ([...gridItems].every((cell) => cell.textContent !== '')) {
                endGame("It's a tie!");
                return;
            }
            // Switch logic for PvP or PvS mode
            if (gameMode === 'PvP') {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            } else if (gameMode === 'PvS' && currentPlayer === 'X') {
                setTimeout(() => {
                    systemMove();
                    if (checkWinner('O')) {
                        endGame('X Loses!');
                        return;
                    }
                    if ([...gridItems].every((cell) => cell.textContent !== '')) {
                        endGame("It's a tie!");
                    }
                }, 300);
            }
        });
    });    

    // Check for a Winner of TicTacToe
    function checkWinner(player) {
        return winningCombinations.some((combination) => {
            return combination.every((index) => {
                return gridItems[index].textContent === player;
            });
        });
    }
    
    // System Move (PvS Mode)
    function systemMove() {
        const emptyCells = Array.from(gridItems).filter(
            (item) => item.textContent === ''
        );
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = 'O';
        randomCell.classList.add('playerO');
        currentPlayer = 'X'; // Switch back to player X
        //item.style.backgroundColor = 'darkgreen';
    }

    // Reset Game of TicTacToe
    function resetGame() {
        console.log("Resetting the game...");
        gridItems.forEach((item) => {
            item.textContent = "";
            item.classList.remove("playerX", "playerO");
            item.style.backgroundColor = ''; // Reset background color
        });
        currentPlayer = "X";
        gameOver = false;
        const resultMessage = document.querySelector(".result");
        if (resultMessage) resultMessage.remove();
    }
    
    // Handle Game End of TicTacToe
    function endGame(message) {
        if (gameOver) return; // Prevent duplicate messages
        gameOver = true;
        const resultMessage = document.querySelector(".result");
        if (resultMessage) resultMessage.remove(); // Remove any previous message
        const newMessage = document.createElement("p");
        newMessage.textContent = message;
        newMessage.classList.add("result");
        document.getElementById("ticTacToe").appendChild(newMessage);
    }
    
    // Show Tic Tac Toe by default on page load
    selectGameButton('ticTacToeButton');
    showGame('ticTacToe');

    //#2.
    // Omok Game Logic (Gomoku)
    // Function to reset and start the Omok game
    function startOmokGame() {
        // Reset the grid and game state
        omokGridItems.forEach(item => {
            item.textContent = '';
            item.classList.remove('playerX', 'playerO');
        });
        omokGameOver = false;
        currentPlayer = 'X'; // X always starts
    }

    // Handle a player's move in Omok
    function omokMove(item) {
        if (item.textContent !== '' || omokGameOver) return;
        // Mark the cell with the current player's symbol
        item.textContent = currentPlayer;
        item.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');

        // Check for a winner or switch turns
        if (checkOmokWinner(currentPlayer)) {
            endOmokGame(`${currentPlayer} Wins!`);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        }
    }

    // Function to check for an Omok winner
    function checkOmokWinner(player) {
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (checkDirection(player, row, col, 1, 0) || // Horizontal
                    checkDirection(player, row, col, 0, 1) || // Vertical
                    checkDirection(player, row, col, 1, 1) || // Diagonal \
                    checkDirection(player, row, col, 1, -1)) { // Diagonal /
                    return true;
                }
            }
        }
        return false;
    }

    // Helper function to check a specific direction for a winning sequence
    function checkDirection(player, row, col, deltaX, deltaY) {
        let count = 0;
        for (let i = 0; i < omokWinningLength; i++) {
            const r = row + i * deltaX;
            const c = col + i * deltaY;
            if (r >= 0 && r < 15 && c >= 0 && c < 15 &&
                omokGridItems[r * 15 + c].textContent === player) {
                count++;
            } else {
                break;
            }
        }
        return count === omokWinningLength;
    }
    
    // Function to handle the end of the Omok game
    function endOmokGame(message) {
        if (omokGameOver) return;
        omokGameOver = true;
        const resultMessage = document.createElement('p');
        resultMessage.textContent = message;
        resultMessage.classList.add('result');
        omokContainer.appendChild(resultMessage);
    }

    // Event Listener for Reset Button
    document.getElementById('resetOmokGame').addEventListener('click', () => {
        startOmokGame(); // Reset the game when the button is clicked
    });
    
    // Initialize the grid when the page is loaded
    initializeOmokGrid();

    // #3. 
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
