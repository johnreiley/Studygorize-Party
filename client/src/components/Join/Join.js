import { useState } from 'react';
import './Join.css';
import Socket from '../../services/SocketService';

function Join() {
  const [partyCode, setPartyCode] = useState();
  const [name, setName] = useState();
  const [showCodeWarning, setShowCodeWarning] = useState();
  const [showNameWarning, setShowNameWarning] = useState();

  const onSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    if (partyCode.length < 4) {
      setShowCodeWarning(true);
      valid = false;
    }
    if (name.length < 1) {
      setShowNameWarning(true);
      valid = false;
    }
    if (valid) {
      Socket.emit('joinParty', { name, partyId: partyCode })
    }
  }

  return (
    <>
      <div className="row">
        <div className="Join-header">
          <h1 className="theme-font text-light">Studygorize Party</h1>
        </div>
      </div>
      <div className="row">
        <form onSubmit={onSubmit} id="joinForm">
          <div className="form-group">
            <label htmlFor="partyCodeInput" className="text-light">Party Code</label>
            <input onChange={e => setPartyCode(e.target.value)} 
              type="text" 
              id="partyCodeInput" 
              className="form-control text-uppercase" 
              maxLength="4" 
              placeholder="enter 4-letter code"
              required
              />
            {showCodeWarning &&
              <div className="alert alert-warning mt-1">
                The code needs to be 4 letters long
              </div>
            }
          </div>
          <div className="form-group">
            <label htmlFor="nameInput" className="text-light">Name</label>
            <input onChange={e => setName(e.target.value)} 
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
          <button type="submit" id="joinBtn" className="btn btn-light">Join</button>
        </form>
      </div>
      <div className="row">
        <footer className="text-light text-center">
          Create your own Studygorize account at
          <strong><a className="text-light" href="https://studygorize.web.app" target="_blank"> studygorize.web.app</a></strong>
        </footer>
      </div>
    </>
  )
}

export default Join;
