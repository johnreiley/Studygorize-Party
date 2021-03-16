import { useEffect, useState } from 'react';
import './Join.css';
import Socket from '../../services/SocketService';
import LocalStorageService from '../../services/LocalStorageService';

function Join(props) {
  const [partyCode, setPartyCode] = useState(LocalStorageService.getItem('partyId'));
  const [name, setName] = useState(LocalStorageService.getItem('name'));
  const [showCodeWarning, setShowCodeWarning] = useState();
  const [showNameWarning, setShowNameWarning] = useState();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    Socket.on('partyNotExist', () => {
      // show warning
      props.setModalTitle('Uh oh!');
      props.setModalBody(`It looks like that party doesn't exist 🙁`);
      props.setShowModal(true);
      setShowSpinner(false);
    });
    Socket.on('nameTaken', () => {
      props.setModalTitle('Oh no!');
      props.setModalBody(`It looks like that name is already taken 😦\nTry something a little more unique!`);
      props.setShowModal(true);
      setShowSpinner(false);
    });

    return () => {
      Socket.off('partyNotExist');
      Socket.off('nameTaken');
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    if (partyCode.length < 4) {
      setShowCodeWarning(true);
      isValid = false;
    }
    if (name.length < 1) {
      setShowNameWarning(true);
      isValid = false;
    }
    if (isValid) {
      setShowSpinner(true);
      console.log("Connected:", Socket.connected);
      if (Socket.disconnected) {
        Socket.connect();
      }
      Socket.emit('joinParty', { name, partyId: partyCode });
      LocalStorageService.setItem('name', name);
      props.emitName(name);
      props.emitPartyId(partyCode);
    }
  }

  return (
    <div className="Join-container">
      <div className="row">
        <div className="Join-header">
          <h1 className="theme-font text-light">Studygorize Party</h1>
        </div>
      </div>
      <div className="row">
        <form onSubmit={onSubmit} id="joinForm">
          <div className="form-group">
            <label htmlFor="partyCodeInput" id="partyCodeLabel" className="text-light">Party Code</label>
            <input onChange={e => setPartyCode(e.target.value)} 
              value={partyCode}
              type="text" 
              id="partyCodeInput" 
              className="form-control text-uppercase" 
              maxLength="4" 
              placeholder="enter 4-letter code"
              autoComplete="off"
              required
              />
            {showCodeWarning &&
              <div className="alert alert-warning mt-1">
                The code needs to be 4 letters long
              </div>
            }
          </div>
          <div className="form-group">
            <label htmlFor="nameInput" id="nameLabel" className="text-light">Name</label>
            <input onChange={e => setName(e.target.value)} 
              value={name}
              type="text" 
              id="nameInput" 
              className="form-control" 
              maxLength="12" 
              placeholder="enter your name"
              required
              />
            {showNameWarning &&
              <div className="alert alert-warning mt-1">
                Enter your name
              </div>
            }
          </div>
          <button type="submit" id="joinBtn" className="btn btn-light">
            {showSpinner && <span class="join-spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            {!showSpinner && <span>Join</span>}
          </button>
        </form>
      </div>
      <div className="row">
        <footer className="Join-footer text-light text-center">
          Create your own Studygorize account at
          <strong><a className="text-light" href="https://studygorize.web.app" target="_blank"> studygorize.web.app</a></strong>
        </footer>
      </div>
    </div>
  )
}

export default Join;
