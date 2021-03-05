import { useState, useEffect } from 'react';
import './App.css';
import Socket from './services/SocketService';
import LocalStorageService from './services/LocalStorageService';
import Join from './components/Join/Join';
import WaitingRoom from './components/WaitingRoom/WaitingRoom';
import QuitBtn from './components/QuitBtn/QuitBtn';
import NameScorePanel from './components/NameScorePanel/NameScorePanel';
import QuestionLoading from './components/QuestionLoading/QuestionLoading';
import QuestionOptions from './components/QuestionOptions/QuestionOptions';
import StatusModal from './components/StatusModal/StatusModal';
import QuestionResult from './components/QuestionResult/QuestionResult';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [uuid, setUuid] = useState(LocalStorageService.getItem('uuid'));
  const [name, setName] = useState(LocalStorageService.getItem('name'));
  const [partyId, setPartyId] = useState(LocalStorageService.getItem('partyId'));
  const [score, setScore] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const initView = (
    <Join 
      name={name} 
      partyId={partyId} 
      emitName={setName} 
      emitPartyId={setPartyId} 
      setShowModal={setShowModal} 
      setModalTitle={setModalTitle}
      setModalBody={setModalBody} />
  )
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

    Socket.on('partyEnded', () => {
      setIsConnected(false);
      setModalTitle('Disconnected');
      setModalBody('You were disconnected from the party because it ended 😥');
      setShowModal(true);
      setView(initView);
    });

    Socket.on('questionLoading', () => {
      setView(<QuestionLoading />)
    });

    Socket.on('showOptions', (count) => {
      setView(<QuestionOptions count={count} />);
    })

    Socket.on('questionResult', ({isCorrect, points}) => {
      addToScore(points);
      setView(<QuestionResult isCorrect={isCorrect} score={points} />)
    });

    Socket.on('disconnect', () => {
      console.log('DISCONNECTED');
      setIsConnected(false);
      setPartyId(LocalStorageService.getItem('partyId'));
      setView(initView);
      Socket.connect();
    })

    return () => {
      Socket.off('partyJoined');
      Socket.off('partyEnded');
    }
  }, []);

  function addToScore(points) {
    setScore(score + points);
  }

  return (
    <div className="App">
      <div className="App-content">
        <StatusModal title={modalTitle} body={modalBody} isOpen={showModal} setIsOpen={setShowModal} />
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
