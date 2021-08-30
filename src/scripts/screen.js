const screen = document.getElementById('screen');
const context = screen.getContext('2d');

function createGame() {
  const state = {
    players: {},
    fruits: {},
  };

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = command.playerX;
    const playerY = command.playerY;

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];
  }

  function addFruit(command) {
    const fruitId = command.fruitId;
    const fruitX = command.fruitX;
    const fruitY = command.fruitY;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];
  }

  function movePlayer(command) {
    const playerId = Object.keys(command.playerId);
    const player = state.players[playerId];

    console.log(`Moving ${playerId} with ${command.keyPressed}`);

    const acceptedMoves = {
      ArrowUp: (player) => {
        if (player.y - 1 >= 0) player.y = player.y - 1;
        return;
      },
      ArrowRight: (player) => {
        if (player.x + 1 < screen.width) player.x = player.x + 1;
        return;
      },
      ArrowDown: (player) => {
        if (player.y + 1 < screen.height) player.y = player.y + 1;
        return;
      },
      ArrowLeft: (player) => {
        if (player.x - 1 >= 0) player.x = player.x - 1;
        return;
      },
    };

    if (!(command.keyPressed in acceptedMoves) || !player) {
      return;
    }

    const moveFunction = acceptedMoves[command.keyPressed];

    moveFunction(player);
    _checkFruitCollision(player);
  }

  function _checkFruitCollision(player) {
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);
        removeFruit({ fruitId });
      }
    }
  }

  return {
    state,
    movePlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
  };
}

function renderScreen() {
  context.clearRect(0, 0, 10, 10);

  for (playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.fillStyle = 'black';
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.fillStyle = 'green';
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  requestAnimationFrame(renderScreen);
}

function createKeyboardListener() {
  const state = {
    observers: [],
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown(event) {
    const keyPressed = event.key;

    const command = {
      playerId: game.state.players,
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
  };
}

const game = createGame();
const keyboardListener = createKeyboardListener();

keyboardListener.subscribe(game.movePlayer);

game.addPlayer({ playerId: 'player1', playerX: 0, playerY: 0 });
game.addFruit({ fruitId: 'fruit1', fruitX: 5, fruitY: 4 });
game.addFruit({ fruitId: 'fruit2', fruitX: 2, fruitY: 1 });

renderScreen();
