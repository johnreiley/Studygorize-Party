import QuitBtn from "../QuitBtn/QuitBtn"

import './WaitingRoom.css';

function WaitingRoom() {
  return (
    <div className="WaitingRoom">
      <h2 className="theme-font">You're in!</h2>
      <span>
        Waiting for the party to start...
      </span>
    </div>
  )
}

export default WaitingRoom
