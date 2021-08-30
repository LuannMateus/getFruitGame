import express, { Request, Response } from 'express';
const socketIo = require('socket.io');
import http from 'http';
import path from 'path';
import { Socket } from 'socket.io';

import createGame from './public/scripts/game.js';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + `/public/scripts`));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/public/view' + '/index.html'));
});

const PORT = 3001;
const HOSTNAME = 'localhost';

const game = createGame();
game.addPlayer({ playerId: 'player1', playerX: 0, playerY: 0 });
game.addFruit({ fruitId: 'fruit1', fruitX: 5, fruitY: 4 });
game.addFruit({ fruitId: 'fruit2', fruitX: 2, fruitY: 3 });
game.addFruit({ fruitId: 'fruit3', fruitX: 6, fruitY: 2 });
game.addFruit({ fruitId: 'fruit4', fruitX: 3, fruitY: 1 });

game.movePlayer({ playerId: 'player1', keyPressed: 'ArrowDown' });

io.on('connection', (socket: Socket) => {
  const playerId = socket.id;
  console.log('Player connected in Server with id: ' + playerId);

  socket.emit('setup', game.state);
});

server.listen(PORT, HOSTNAME, () => {
  console.log('Server is running in http://localhost:3001');
});
