import createKeyboardListener from './keyboard-listener.js';
import createGame from './game.js';
import renderScreen from './render-screen.js';

const socket = io();

const game = createGame();
const keyboardListener = createKeyboardListener(document);

socket.on('connect', () => {
  const playerId = socket.id;

  console.log('Player connect with ID -> ' + playerId);

  const screen = document.getElementById('screen');
  renderScreen(screen, game, requestAnimationFrame, playerId);
});

socket.on('setup', (state) => {
  const playerId = socket.id;
  game.setState(state);

  keyboardListener.registerPlayerId(playerId);
  keyboardListener.subscribe(game.movePlayer);
  keyboardListener.subscribe((command) => {
    socket.emit('move-player', command);
  });
});

socket.on('add-player', (command) => {
  console.log(
    `Receiving ${command.type} -> (${command.playerX}, ${command.playerY}) }`
  );
  game.addPlayer(command);
});

socket.on('remove-player', (command) => {
  console.log(`Receiving ${command.type} -> DELETE (${command.playerId} }`);
  game.removePlayer(command);
});

socket.on('move-player', (command) => {
  const playerId = socket.id;

  if (playerId !== command.playerId) {
    game.movePlayer(command);
  }
});

socket.on('add-fruit', (command) => {
  game.addFruit(command);
});

socket.on('remove-fruit', (command) => {
  game.removeFruit(command);
});
