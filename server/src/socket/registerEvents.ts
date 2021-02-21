import { v4 as uuidv4 } from 'uuid';
import randomize from 'randomatic';
import { Socket } from 'socket.io';
import Party from '../models/Party';

// the partyId is the dictionary key
const parties: Record<string, Party> = {};

// this dictionary is for keeping track of
// which party a uuid is associated with.
// uuid is the key, partyId is the value
const uuidPartyIdDictionary: Record<string, string> = {};

export default function registerEvents(io: any, socket: Socket) {

  /******************************
   * CREATE PARTY
   ******************************/
  socket.on('createParty', () => {
    const uuid = uuidv4();
    let partyId = randomize('A', 4);
    // make sure the id is unique
    while (parties[partyId]) {
      partyId = randomize('A', 4);
    }
    parties[partyId] = {
      host: { uuid },
      users: [],
      state: {
        page: Page.WaitingRoom.toString(),
        data: null
      }
    }

    uuidPartyIdDictionary[uuid] = partyId;
    socket.join(partyId);
    socket.join(uuid); // TODO: figure out how a client will communicate directly with the host...!!!
    socket.emit('partyCreated', { partyId });
  });

  /*******************************
   * JOIN PARTY
   *******************************/
  socket.on('joinParty', ({ name, partyId }) => {
    name = name.toUpperCase();
    partyId = partyId.toUpperCase();

    if (!parties[partyId]) {
      socket.emit('partyNotExist');
      return;
    }
    if (parties[partyId].users.filter(u => u.name === name).length > 0) {
      socket.emit('nameTaken');
      return;
    }

    const user = {
      uuid: uuidv4(),
      socketId: socket.id,
      name
    }
    parties[partyId].users.push(user);

    uuidPartyIdDictionary[user.uuid] = partyId;
    socket.join(partyId);
    socket.emit('partyJoined', { partyId, uuid: user.uuid })
    socket.broadcast.to(parties[partyId].host.uuid).emit('userJoined', user);
  });

  /*******************************
   * DISCONNECT
   *******************************/
  socket.on('disconnect', () => {
    console.log(`a user disconnected from socket ${socket.id}`);
  });
}