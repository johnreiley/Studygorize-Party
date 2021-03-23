import { useState, useEffect, useRef } from 'react';
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
import PartyResults from './components/PartyResults/PartyResults';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [uuid, setUuid] = useState(LocalStorageService.getItem('uuid'));
  const [name, setName] = useState(LocalStorageService.getItem('name'));
  const [partyId, setPartyId] = useState(LocalStorageService.getItem('partyId'));
  const [score, setScore] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const scoreRef = useRef();

  scoreRef.current = score;

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

    Socket.on('partyRejoined', ({name, score}) => {
      setScore(score);
      setName(name);
      LocalStorageService.setItem('name', name);
      setIsConnected(true);
      setView(<WaitingRoom />)
    });

    Socket.on('partyEnded', () => {
      setIsConnected(false);
      setScore(0);
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

    Socket.on('questionResult', handleQuestionResult);

    Socket.on('partyResults', (score) => {
      setView(<PartyResults score={score} />);
      setScore(0);
    })

    Socket.on('disconnect', () => {
      console.log('DISCONNECTED');
      setIsConnected(false);
      setPartyId(LocalStorageService.getItem('partyId'));
      setScore(0);
      setView(initView);
      Socket.connect();
    })

    return () => {
      Socket.off('partyJoined');
      Socket.off('partyRejoined');
      Socket.off('partyEnded');
      Socket.off('questionLoading');
      Socket.off('showOptions');
      Socket.off('questionResult');
      Socket.off('partyResults');
      Socket.off('disconnect');
    }
  }, []);

  function handleQuestionResult({isCorrect, points}) {
    setScore(scoreRef.current + points);
    setView(<QuestionResult isCorrect={isCorrect} score={points} />)
  }

  return (
    <div className="App bg-primary">
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
