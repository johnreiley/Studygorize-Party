import './QuitBtn.css';
import Socket from '../../services/SocketService';
import LocalStorageService from '../../services/LocalStorageService';

function QuitBtn() {

  function onQuit() {
    LocalStorageService.removeItem('uuid');
    Socket.emit('leaveParty');
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
