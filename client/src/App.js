import { useState, useEffect } from 'react';
import './App.css';
import Socket from './services/SocketService';
import LocalStorageService from './services/LocalStorageService';
import Join from './components/Join/Join';
import WaitingRoom from './components/WaitingRoom/WaitingRoom';
import QuitBtn from './components/QuitBtn/QuitBtn';
import NameScorePanel from './components/NameScorePanel/NameScorePanel';


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [uuid, setUuid] = useState(LocalStorageService.getItem('uuid'));
  const [name, setName] = useState(LocalStorageService.getItem('name'));
  const [partyId, setPartyId] = useState(LocalStorageService.getItem('partyId'));
  const [score, setScore] = useState(null);

  const initView = (<Join name={name} partyId={partyId} emitName={setName} emitPartyId={setPartyId} />)
  const [view, setView] = useState(initView);

  useEffect(() => {
    Socket.on('partyJoined', ({ partyId, uuid }) => {
      // store these
      LocalStorageService.setItem('partyId', partyId);
      LocalStorageService.setItem('uuid', uuid);
      setIsConnected(true);
      setView(<WaitingRoom />)
      console.log(`Party ${partyId} joined!`)
    })

    Socket.on('disconnect', () => {
      console.log('DISCONNECTED');
      setIsConnected(false);
      setPartyId(LocalStorageService.getItem('partyId'));
      setView(initView);
      Socket.connect();
    })

    return () => {
      Socket.off('partyJoined');
    }
  }, []);

  return (
    <div className="App">
      <div className="App-content">
        {isConnected && 
          <QuitBtn />
        }
        {view}
        {isConnected && 
          <NameScorePanel name={name} score={score} />
        }
      </div>
    </div>
  );
}

export default App;
