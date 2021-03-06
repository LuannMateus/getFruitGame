export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 40,
      height: 20,
    },
  };

  const observers = [];

  function start() {
    const frequency = 2000;

    setInterval(addFruit, frequency);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const { playerId } = command;
    const playerX =
      'playerX' in command
        ? command.playerX
        : Math.floor(Math.random() * state.screen.width);
    const playerY =
      'playerY' in command
        ? command.playerY
        : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      points: 0,
    };

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];

    notifyAll({
      type: 'remove-player',
      playerId,
    });
  }

  function addFruit(command) {
    const fruitId = command
      ? command.fruitId
      : Math.floor(Math.random() * 100000000);
    const fruitX = command
      ? command.fruitX
      : Math.floor(Math.random() * state.screen.width);
    const fruitY = command
      ? command.fruitY
      : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };

    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY,
    });
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];

    notifyAll({
      type: 'remove-fruit',
      fruitId,
    });
  }

  function movePlayer(command) {
    notifyAll(command);

    const playerId = command.playerId;
    const player = state.players[playerId];

    console.log(`Moving ${playerId} with ${command.keyPressed}`);

    const acceptedMoves = {
      ArrowUp: (player) => {
        if (player.y - 1 >= 0) player.y = player.y - 1;
        return;
      },
      ArrowRight: (player) => {
        if (player.x + 1 < state.screen.width) player.x = player.x + 1;
        return;
      },
      ArrowDown: (player) => {
        if (player.y + 1 < state.screen.height) player.y = player.y + 1;
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
        removeFruit({ fruitId });
        player.points++;

        notifyAll({
          type: 'players',
        });
      }
    }
  }

  return {
    start,
    state,
    setState,
    subscribe,
    notifyAll,
    movePlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
  };
}
