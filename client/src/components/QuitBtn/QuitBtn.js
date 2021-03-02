import './QuitBtn.css';
import Socket from '../../services/SocketService';

function QuitBtn() {

  function onQuit() {
    Socket.close();
  }

  return (
    <button 
      className="QuitBtn btn" 
      onClick={onQuit}>
      <strong>Quit</strong>
    </button>
  )
}

export default QuitBtn
