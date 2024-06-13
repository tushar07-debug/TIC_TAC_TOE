    document.addEventListener('DOMContentLoaded', () => {
      const cells = document.querySelectorAll('.cell');
      const resetBtn = document.getElementById('reset-btn');
      const resultDisplay = document.getElementById('result-display');
      const resetScore = document.getElementById('js-reset-score-btn');
      const autoPlay = document.getElementById('js-autoplay');
      const scoreCardDisplay = document.getElementById('scorecard-display');
      let currentPlayer = 'X';
      let gameActive = true;
      let scoreCard = JSON.parse(localStorage.getItem('score')) || {
        win: 0,
        losses: 0,
        ties: 0,
      };

      //localStorage.removeItem('score');
      console.log(scoreCard);
      // Initialize game
      cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
      });

      resetScore.addEventListener('click', () => {
        scoreCard.win = 0;
        scoreCard.losses = 0;
        scoreCard.ties = 0;
        localStorage.removeItem('score');
        displayScoreCard();
      });

      resetBtn.addEventListener('click', resetGame);

      let autoPlayIntervalId;

    autoPlay.addEventListener('click', () => {
      resetGame();
        if (autoPlay.innerHTML === `AutoPlay`) {
            autoPlayIntervalId = setInterval(() => {
                if (gameActive) {
                    if (currentPlayer === 'O') {
                        makeComputerMove();
                    } else {
                        pickUserMove();
                    }
                    if (checkDraw()) {
                        resultDisplay.textContent = 'Draw!';
                        scoreCard.ties++;
                        displayScoreCard();
                        gameActive = false;
                        clearInterval(autoPlayIntervalId);
                        autoPlay.checked = false;
                    }                    
                } else {
                    clearInterval(autoPlayIntervalId);
                    autoPlay.innerHTML = 'AutoPlay';
                }
                localStorage.setItem('score', JSON.stringify(scoreCard));
            }, 1000);
            autoPlay.innerHTML = `Stop AutoPlaying`;
            //localStorage.setItem('score',JSON.stringify(scoreCard));
        } else {
            clearInterval(autoPlayIntervalId);
            autoPlay.innerHTML = 'AutoPlay';
        }
    });

      function handleCellClick(event) {
        const cell = event.target;
        if (!gameActive || cell.textContent !== '') return;

        cell.textContent = currentPlayer;
        if (checkWinner()) {
          resultDisplay.textContent = `Player ${currentPlayer} Wins!`;
          scoreCard.win++;
          displayScoreCard();
          gameActive = false;
        } else if (checkDraw()) {
          resultDisplay.textContent = 'Draw!';
          scoreCard.ties++;
          displayScoreCard();
          gameActive = false;
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          if (currentPlayer === 'O') {
            makeComputerMove();
          }
        }
        localStorage.setItem('score',JSON.stringify(scoreCard));
        //localStorage.setItem('score',scoreCard);
      }

      
      function handleCellClick2(event) {
        const cell = event.target;
        if (!gameActive || cell.textContent !== '') return;

        cell.textContent = currentPlayer;
        if (checkWinner()) {
          resultDisplay.textContent = `Player ${currentPlayer} Wins!`;
          scoreCard.win++;
          displayScoreCard();
          gameActive = false;
        } else if (checkDraw()) {
          resultDisplay.textContent = 'Draw!';
          scoreCard.ties++;
          displayScoreCard();
          gameActive = false;
        } else {
          currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
          if (currentPlayer === 'X') {
            pickUserMove();
          }
        }
        localStorage.setItem('score',JSON.stringify(scoreCard));
        //localStorage.setItem('score',scoreCard);
      }

      displayScoreCard();
      
      function displayScoreCard(){
        scoreCardDisplay.textContent = `Wins ${scoreCard.win}, Losses ${scoreCard.losses}, Ties ${scoreCard.ties}`;
      }

      function checkWinner() {
        const winningCombos = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
          [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let combo of winningCombos) {
          const [a, b, c] = combo;
          if (cells[a].textContent &&
              cells[a].textContent === cells[b].textContent &&
              cells[a].textContent === cells[c].textContent) {
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
            return true;
          }
        }
        return false;
      }

      function checkDraw() {
        return Array.from(cells).every(cell => cell.textContent !== '');
      }

      function resetGame() {
        cells.forEach(cell => {
          cell.textContent = '';
          cell.classList.remove('winner');
        });
        resultDisplay.textContent = '';
        gameActive = true;
        currentPlayer = 'X';
      }

      function pickUserMove() {
        const availableMoves = [];
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].textContent === '') {
            availableMoves.push(i);
          }
        }
        // Look for winning moves
        for (let move of availableMoves) {
          cells[move].textContent = 'X';
          if (checkWinner()) {
            resultDisplay.textContent = `Player ${currentPlayer} Wins!`;
            scoreCard.win++;
            displayScoreCard();
            gameActive = false;
            return;
          }
          cells[move].textContent = '';
        }
        // Look for blocking moves
        for (let move of availableMoves) {
          cells[move].textContent = 'O';
          if (checkWinner()) {
            cells[move].textContent = 'X';
            currentPlayer = 'O';
            return;
          }
          cells[move].textContent = '';
        }        
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        cells[availableMoves[randomIndex]].textContent = 'X';
        currentPlayer = 'O';
        localStorage.setItem('score',JSON.stringify(scoreCard));
      }

      function makeComputerMove() {
        const availableMoves = [];
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].textContent === '') {
            availableMoves.push(i);
          }
        }
        // Look for winning moves
        for (let move of availableMoves) {
          cells[move].textContent = 'O';
          if (checkWinner()) {
            resultDisplay.textContent = 'Computer Wins!';
            scoreCard.losses++;
            displayScoreCard();
            gameActive = false;
            return;
          }
          cells[move].textContent = '';
        }
        // Look for blocking moves
        for (let move of availableMoves) {
          cells[move].textContent = 'X';
          if (checkWinner()) {
            cells[move].textContent = 'O';
            currentPlayer = 'X';
            return;
          }
          cells[move].textContent = '';
        }
        // Otherwise, make a random move
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        cells[availableMoves[randomIndex]].textContent = 'O';
        currentPlayer = 'X';
      }
    });