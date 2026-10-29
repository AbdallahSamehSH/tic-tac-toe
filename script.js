const Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
    return board;
  }

  function placeMark(index, mark) {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  }

  function resetBoard() {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  }

  return {
    getBoard,
    placeMark,
    resetBoard
  };
})();

function Player(name, mark) {
  return {
    name,
    mark
  };
}

const GameController = (function () {
  const players = [
    Player("Player X", "X"),
    Player("Player O", "O")
  ];

  let activePlayer = players[0];
  let isGameOver = false;
  let statusMessage = `${activePlayer.name}'s turn`;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const getActivePlayer = () => activePlayer;
  const getGameStatus = () => statusMessage;

  function switchPlayerTurn() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    statusMessage = `${activePlayer.name}'s turn`;
  }

  function checkWinner() {
    const board = Gameboard.getBoard();

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
        return true;
      }
    }
    return false;
  }

  function playRound(index) {
    if (isGameOver) return;

    const moveSuccess = Gameboard.placeMark(index, activePlayer.mark);

    if (moveSuccess) {
      if (checkWinner()) {
        statusMessage = `${activePlayer.name} wins!`;
        isGameOver = true;
        return;
      }

      const isTie = Gameboard.getBoard().every(cell => cell !== "");
      if (isTie) {
        statusMessage = "It's a tie!";
        isGameOver = true;
        return;
      }

      switchPlayerTurn();
    }
  }

  function restartGame() {
    Gameboard.resetBoard();
    activePlayer = players[0];
    isGameOver = false;
    statusMessage = `${activePlayer.name}'s turn`;
  }

  return {
    playRound,
    getActivePlayer,
    getGameStatus,
    restartGame
  };
})();

const DisplayController = (function () {
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");
  const restartBtn = document.getElementById("restart-btn");

  function render() {
    boardElement.innerHTML = "";
    statusElement.textContent = GameController.getGameStatus();

    const board = Gameboard.getBoard();

    board.forEach((cell, index) => {
      const square = document.createElement("div");
      square.classList.add("cell");
      square.textContent = cell;

      square.addEventListener("click", () => {
        GameController.playRound(index);
        render();
      });

      boardElement.appendChild(square);
    });
  }

  restartBtn.addEventListener("click", () => {
    GameController.restartGame();
    render();
  });

  render();
})();