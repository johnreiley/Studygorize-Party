const { v4: uuidv4 } = require('uuid');
const randomize = require('randomatic');

const registerEvents = (io, socket) => {
  socket.on('test', () => {
    socket.emit('test');
  })
}

module.exports = registerEvents;