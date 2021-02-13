const { v4: uuidv4 } = require('uuid');
const randomize = require('randomatic');

// the partyId is the dictionary key
const parties = {};

// this dictionary is for keeping track of 
// which party a uuid is associated with.
// uuid is the key, partyId is the value
const uuidPartyDictionary = {};

let roomDefinition = {
  hostId: {
    uuid: 'string'
  },
  users: [
    {
      uuid: 'string',
      socketId: 'string',
      name: 'string',
    }
  ],
  state: {
    page: 'string',
  }
}

const registerEvents = (io, socket) => {
  // put events here...

  /******************************
   * CREATE PARTY
   ******************************/
  socket.on('createParty', () => {
    // create a uid
    const uuid = uuidv4();
    // create a roomId
    let partyId = randomize('A', 4);
    // make sure the id is unique
    while (parties[partyId]) {
      partyId = randomize('A', 4);
    }
    parties[partyId] = {
      host: { uuid },
      users: [],
      state: {
        // setup initial state
      }
    }

    uuidPartyDictionary[uuid] = 
    socket.join(partyId);
    socket.join(uuid); // figure out how a client will communicate directly with the host...!!!
    socket.emit('partyCreated', { partyId });
  });

  /*******************************
   * JOIN PARTY
   *******************************/
  socket.on('joinParty', ({ name, partyId }) => {
    if (!parties[partyId]) {
      // emit partyNotExist
      return;
    } 
    if (parties[partyId].users.filter(u => u.name === name).length > 0) {
      // emit nameTaken
      return;
    }

    const uuid = uuidv4();
    parties[partyId].users.push({
      uuid,
      socketId: socket.id,
      name: name.toUpperCase()
    });

    uuidPartyDictionary[uuid] = partyId;
    socket.join(partyId);
    socket.emit('partyJoined', { partyId, uuid })
    socket.broadcast.to(partyId).emit('userJoined', {});
  });

}

module.exports = registerEvents;