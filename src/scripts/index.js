import createKeyboardListener from './keyboard-listener.js';
import createGame from './game.js';
import renderScreen from './render-screen.js';

const screen = document.getElementById('screen');

const game = createGame();
const keyboardListener = createKeyboardListener(document);

keyboardListener.subscribe(game.movePlayer);

game.addPlayer({ playerId: 'player1', playerX: 0, playerY: 0 });
game.addFruit({ fruitId: 'fruit1', fruitX: 5, fruitY: 4 });
game.addFruit({ fruitId: 'fruit2', fruitX: 2, fruitY: 1 });

renderScreen(screen, game, requestAnimationFrame);
