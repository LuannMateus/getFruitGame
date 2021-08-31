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

socket.on('players', (data) => {
  const scoreTable = document.querySelector('.table__body');
  const playersId = Object.keys(game.state.players);

  const playersRanking = playersId
    .map((playerId) => {
      const { points } = game.state.players[playerId];

      return `  
      <tr>
        <td>
          <p class="ranking-players__title">${playerId}</p>
        </td>
        <td>
          <span class="ranking-players__points">${points}</span>
        </td>
      </tr>
    `;
    })
    .join('');

  scoreTable.innerHTML = playersRanking;
});

socket.on('total-players', (data) => {
  const totalPlayers = data;

  const totalPlayersElement = document.querySelector('.total-players__total');

  totalPlayersElement.innerHTML = totalPlayers;
});
