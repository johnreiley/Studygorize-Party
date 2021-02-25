import './QuitBtn.css';
import Socket from '../../services/SocketService';

function QuitBtn(/*{ onClick }*/) {

  function onQuit() {
    // onClick();
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
