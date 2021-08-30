import createKeyboardListener from './keyboard-listener.js';
import createGame from './game.js';
import renderScreen from './render-screen.js';

const socket = io();

const screen = document.getElementById('screen');

const game = createGame();
const keyboardListener = createKeyboardListener(document);

keyboardListener.subscribe(game.movePlayer);

renderScreen(screen, game, requestAnimationFrame);

socket.on('connect', () => {
  const playerId = socket.id;

  console.log(playerId);
});

socket.on('setup', (state) => {
  game.setState(state);
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
