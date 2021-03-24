import { v4 as uuidv4 } from 'uuid';
import randomize from 'randomatic';
import { Server, Socket } from 'socket.io';
import Party from '../models/Party.model';
import { assert, exception } from 'console';
import { PartyState } from '../models/PartyState.enum';

// the partyId is the dictionary key
const parties: Record<string, Party> = {};

// this dictionary is for keeping track of
// which party a uuid is associated with.
// uuid is the key, partyId is the value
const uuidPartyIdDictionary: Record<string, string> = {};
const socketIdPartyIdDictionary: Record<string, string> = {};

export default function registerEvents(io: Server, socket: Socket) {

  /******************************
   * CREATE PARTY: from Host
   ******************************/
  socket.on('createParty', () => {
    const uuid = uuidv4();
    let partyId = randomize('A', 4);
    // make sure the id is unique
    while (parties[partyId]) {
      partyId = randomize('A', 4);
    }
    parties[partyId] = {
      host: { uuid, socketId: socket.id },
      users: [],
      state: PartyState.WaitingRoom
    }

    // uuidPartyIdDictionary[uuid] = partyId;
    socketIdPartyIdDictionary[socket.id] = partyId;
    socket.join(partyId);
    socket.join(uuid);
    socket.emit('partyCreated', partyId);

    console.log(`Party with partyId of ${partyId} created`);
  });

  /*******************************
   * JOIN PARTY: from Client
   *******************************/
  socket.on('joinParty', ({ name, partyId }) => {
    partyId = partyId.toUpperCase();

    if (!parties[partyId]) {
      socket.emit('partyNotExist');
      return;
    }
    if (parties[partyId].users.filter(u => u.name === name).length > 0) {
      socket.emit('nameTaken');
      return;
    }

    console.log(`Connecting user to party: ${partyId}`);

    const user = {
      uuid: uuidv4(),
      socketId: socket.id,
      name,
      score: 0
    }
    parties[partyId].users.push(user);

    uuidPartyIdDictionary[user.uuid] = partyId;
    socketIdPartyIdDictionary[socket.id] = partyId;
    socket.join(partyId);
    socket.emit('partyJoined', { partyId, uuid: user.uuid })
    io.to(parties[partyId].host.socketId).emit('userJoined', user);
  });

  /*******************************
   * JOIN PARTY: from Client
   *******************************/
  socket.on('rejoinParty', (uuid) => {
    let partyId = uuidPartyIdDictionary[uuid];
    if (partyId === undefined || parties[partyId] === undefined) {
      socket.emit('uuidNotExist');
      return;
    }
    let user = parties[partyId].users.find(u => u.uuid === uuid);
    user.socketId = socket.id;
    socketIdPartyIdDictionary[socket.id] = partyId;
    socket.join(partyId);
    socket.emit('partyRejoined', {name: user.name, score: user.score});
  });

  /*******************************
   * QUESTION LOADING: from Host
   *******************************/
  socket.on('questionLoading', () => {
    let partyId = socketIdPartyIdDictionary[socket.id];
    if (partyId) {
      parties[partyId].state = PartyState.QuestionLoading;
      socket.to(partyId).emit('questionLoading');
    } else {
      // to be taken out after testing
      throw exception('ERROR: HOST HAD NO SOCKET ID ENTRY IN socketIdPartyIdDictionary!');
    }
  });

  /*******************************
   * SHOW OPTIONS: from Host
   *******************************/
  socket.on('showOptions', (count: number) => {
    let partyId = socketIdPartyIdDictionary[socket.id];
    if (partyId) {
      parties[partyId].state = PartyState.ShowOptions;
      socket.to(partyId).emit('showOptions', count);
    } else {
      // to be taken out after testing
      throw exception('ERROR: HOST HAD NO SOCKET ID ENTRY IN socketIdPartyIdDictionary!');
    }
  })

  /*******************************
   * SELECT OPTION: from Client
   *******************************/
  socket.on('selectOption', (value: number) => {
    // find host uuid
    let partyId = socketIdPartyIdDictionary[socket.id];
    if (partyId && parties[partyId]) {
      let hostSocketId = parties[partyId].host.socketId;
      let clientUuid = parties[partyId].users.find(u => u.socketId === socket.id).uuid;
      if (hostSocketId) {
        // send the selection to the host
        io.to(hostSocketId).emit('selectOption', { uuid: clientUuid, value });
      }
    }
  })

  /*******************************
   * QUESTION RESULT: from Host
   *******************************/
  socket.on('questionResult', (questionResults: {uuid: string, isCorrect: boolean, score: number}[]) => {
    for (let result of questionResults) {
      let partyId = socketIdPartyIdDictionary[socket.id];
      if (partyId) {
        parties[partyId].state = PartyState.QuestionResult;
        // find the user to send to
        let user = parties[partyId].users.find(u => u.uuid === result.uuid);
        console.log(user.name, " ", result.score);

        io.to(user.socketId).emit('questionResult', { isCorrect: result.isCorrect, points: result.score });
        // update the current user's score
        user.score += result.score;
      } else {
        // to be taken out after testing
        throw exception('ERROR: HOST HAD NO SOCKET ID ENTRY IN socketIdPartyIdDictionary!');
      }
    }
  })

  /*******************************
   * PARTY RESULTS: from Host
   *******************************/
  socket.on('partyResults', () => {
    let partyId = socketIdPartyIdDictionary[socket.id];
    if (partyId) {
      parties[partyId].state = PartyState.PartyResults;
      parties[partyId].users.forEach(u => {
        io.to(u.socketId).emit('partyResults', u.score);
      });
    } else {
      // to be taken out after testing
      throw exception('ERROR: HOST HAD NO SOCKET ID ENTRY IN socketIdPartyIdDictionary!');
    }
  })

  /*******************************
   * LEAVE PARTY: from Client
   *******************************/
  socket.on('leaveParty', () => {
    let partyId = socketIdPartyIdDictionary[socket.id];
    
    // find the user and remove them
    let user = parties[partyId].users.find(u => u.socketId === socket.id);
    if (user !== undefined) {
      socket.to(parties[partyId].host.uuid).emit('userLeft', user.uuid);
      let index = parties[partyId].users.indexOf(user);
      parties[partyId].users.splice(index, 1);
    }
    delete uuidPartyIdDictionary[partyId];
  });

  /*******************************
   * DISCONNECT
   *******************************/
  socket.on('disconnect', () => {
    let partyId = socketIdPartyIdDictionary[socket.id];
    if (partyId === undefined || parties[partyId] === undefined) {
      console.log(`An unknown user disconnected from socket ${socket.id}`);
      return;
    }

    // remove the host and delete the party 
    if (parties[partyId].host.socketId === socket.id || parties[partyId].users.length === 0) {
      socket.to(partyId).emit('partyEnded');
      delete parties[partyId];
      console.log(`Party with partyId of ${partyId} ended`)
      console.log(`A host disconnected from socket ${socket.id}`);
    } else {
      console.log(`User timedout from socket ${socket.id}`);
    }
    delete socketIdPartyIdDictionary[socket.id];
  });
}