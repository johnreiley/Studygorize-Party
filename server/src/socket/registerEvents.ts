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
    console.log("create a party!!!");

    const uuid = uuidv4();
    let partyId = randomize('A', 4);
    // make sure the id is unique
    while (parties[partyId]) {
      partyId = randomize('A', 4);
    }
    parties[partyId] = {
      host: { uuid },
      users: [],
      state: PartyState.WaitingRoom
    }

    // uuidPartyIdDictionary[uuid] = partyId;
    socketIdPartyIdDictionary[socket.id] = partyId;
    socket.join(partyId);
    socket.join(uuid);
    socket.emit('partyCreated', { partyId });
  });

  /*******************************
   * JOIN PARTY: from Client
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
      name,
      score: 0
    }
    parties[partyId].users.push(user);

    // uuidPartyIdDictionary[user.uuid] = partyId;
    socketIdPartyIdDictionary[socket.id] = partyId;
    socket.join(partyId);
    socket.emit('partyJoined', { partyId, uuid: user.uuid })
    socket.broadcast.to(parties[partyId].host.uuid).emit('userJoined', user);
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
      let hostUuid = parties[partyId].host.uuid;
      let clientUuid = parties[partyId].users.find(u => u.socketId === socket.id).uuid;
      if (hostUuid) {
        // send the selection to the host
        socket.to(hostUuid).emit('selectOption', { uuid: clientUuid, value });
      }
    }
  })

  /*******************************
   * QUESTION RESULT: from Host
   *******************************/
  socket.on('questionResult', ({ uuid, isCorrect, score }) => {
    let partyId = socketIdPartyIdDictionary[socket.id];
    if (partyId) {
      parties[partyId].state = PartyState.QuestionResult;
      // find the user to send to
      let user = parties[partyId].users.find(u => u.uuid === uuid);
      io.to(user.socketId).emit('questionResult', { isCorrect, score });
      // update the current user's score
      user.score = score;
    } else {
      // to be taken out after testing
      throw exception('ERROR: HOST HAD NO SOCKET ID ENTRY IN socketIdPartyIdDictionary!');
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
        io.to(u.uuid).emit('partyResults', u.score);
      });
    } else {
      // to be taken out after testing
      throw exception('ERROR: HOST HAD NO SOCKET ID ENTRY IN socketIdPartyIdDictionary!');
    }
  })

  /*******************************
   * DISCONNECT
   *******************************/
  socket.on('disconnect', () => {
    console.log(`a user disconnected from socket ${socket.id}`);
  });
}