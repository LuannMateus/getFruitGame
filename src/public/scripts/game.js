export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
    },
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
    const playerId = command.playerId;
    const player = state.players[playerId];

    console.log(state);

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
