import { Server, Socket } from "socket.io";
import { Request, Response } from "express";
import express from 'express';
import path from 'path';
import registerEvents from './socket/registerEvents';

const app = express();
const http = require('http').createServer(app);
const io = new Server(http);

if (process.env.NODE_ENV !== 'production') {
  let cors = require('cors');
  app.use(cors());
}

app.use('/static', express.static(path.join(__dirname, '../../client/build//static')));
app.get('*', (req: Request, res: Response) => {
  console.log(__dirname)
  res.sendFile('index.html', {root: path.join(__dirname, '../../client/build/')});
});

io.on('connection', (socket: Socket) => {
  console.log(`a user connected at socket ${socket.id}`);
  registerEvents(io, socket);
})

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});