document.addEventListener('DOMContentLoaded', function () {
    const ticTacToeContainer = document.getElementById('ticTacToe');
    const omokContainer = document.getElementById('omok');
    const baseballContainer = document.getElementById('baseball');

    const ticTacToeButton = document.getElementById('ticTacToeButton');
    const omokButton = document.getElementById('omokButton');
    const baseballButton = document.getElementById('baseballButton');

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
    
    // Menu Button Event Listeners
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

    // Reset Game
    resetButton.addEventListener("click", resetGame);

    gridItems.forEach((item) => {
        item.addEventListener('click', function () {
            if (item.textContent !== '' || gameOver) return;

            // Player move logic
            item.textContent = currentPlayer;
            item.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');
            
            // item.style.backgroundColor = 'darkgreen';
            
            // Log current game state after a move
            console.log("Current Player:", currentPlayer);
            console.log("Game Mode:", gameMode);
            console.log("Board State:", [...gridItems].map(cell => cell.textContent));

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

                    // Log after the system's move
                    console.log("Current Player:", currentPlayer);
                    console.log("Game Mode:", gameMode);
                    console.log("Board State:", [...gridItems].map(cell => cell.textContent));
                    
                }, 300);
            }
        });
    });

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
    
        console.log("Game reset complete. Current Player:", currentPlayer);
        console.log("Game Mode:", gameMode);
        console.log("Board State:", [...gridItems].map(cell => cell.textContent));    
    }

    // Check for a Winner
    function checkWinner(player) {
        return winningCombinations.some((combination) => {
            return combination.every((index) => {
                return gridItems[index].textContent === player;
            });
        });
    }

    // Handle Game End
    function endGame(message) {
        if (gameOver) return; // Prevent duplicate messages
        gameOver = true;
        const resultMessage = document.querySelector(".result");
        if (resultMessage) resultMessage.remove(); // Remove any previous message
        const newMessage = document.createElement("p");
        newMessage.textContent = message;
        newMessage.classList.add("result");
        document.getElementById("ticTacToe").appendChild(newMessage);

        // Log final game state when game ends
        console.log("Game Over:", message);
        console.log("Final Board State:", [...gridItems].map(cell => cell.textContent));
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
