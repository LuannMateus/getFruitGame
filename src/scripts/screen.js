const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const keyboardMovement = {
  ArrowUp: (playerId) => {
    player = game.state.players[playerId];
    if (player.y - 1 >= 0) player.y = player.y - 1;
    return;
  },
  ArrowRight: (playerId) => {
    player = game.state.players[playerId];
    if (player.x + 1 < screen.width) player.x = player.x + 1;
    return;
  },
  ArrowDown: (playerId) => {
    player = game.state.players[playerId];
    if (player.y + 1 < screen.height) player.y = player.y + 1;
    return;
  },
  ArrowLeft: (playerId) => {
    player = game.state.players[playerId];
    if (player.x - 1 >= 0) player.x = player.x - 1;
    return;
  },
};

function createGame() {
  const state = {
    players: {
      player1: { x: 1, y: 1 },
      player2: { x: 9, y: 9 },
    },
    fruits: {
      fruit1: { x: 3, y: 1 },
    },
  };

  function movePlayer(command) {
    console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

    keyboardMovement[command.keyPressed](command.playerId);
  }

  return {
    movePlayer,
    state,
  };
}

const game = createGame();
const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

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

    if (!(keyPressed in keyboardMovement)) {
      return;
    }

    const command = {
      playerId: 'player1',
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
  };
}

renderScreen();
