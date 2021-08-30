import express, { Request, Response } from 'express';
const socketIo = require('socket.io');
import http from 'http';
import path from 'path';
import { Socket } from 'socket.io';
import { Command } from './model/Command.js';

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

game.subscribe((command: Command) => {
  console.log(`> Emitting ${command.type}`);

  io.emit(command.type, command);
});

io.on('connection', (socket: Socket) => {
  const playerId = socket.id;
  console.log('Player connected in Server with id: ' + playerId);

  game.addPlayer({ playerId });

  socket.emit('setup', game.state);

  socket.on('disconnect', () => {
    game.removePlayer({ playerId });
  });

  socket.on('move-player', (command: Command) => {
    command.playerId = playerId;
    command.type = 'move-player';

    game.movePlayer(command);
  });
});

server.listen(PORT, HOSTNAME, () => {
  console.log('Server is running in http://localhost:3001');
});
