import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';

// import createGame from './scripts/game.js';

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
app.use('/scripts', express.static('./src/scripts'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/view' + '/index.html'));
});

const PORT = 3001;
const HOSTNAME = 'localhost';

// const game = createGame();
// game.addPlayer({ playerId: 'player1', playerX: 0, playerY: 0 });
// game.addFruit({ fruitId: 'fruit1', fruitX: 5, fruitY: 4 });
// game.addFruit({ fruitId: 'fruit2', fruitX: 2, fruitY: 1 });

// game.movePlayer({ playerId: 'player1', keyPressed: 'ArrowDown' });

// console.log(game.state);

server.listen(PORT, HOSTNAME, () => {
  console.log('Server is running in http://localhost:3001');
});
