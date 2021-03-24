import './WaitingRoom.css';

function WaitingRoom({title, message}) {
  return (
    <div className="WaitingRoom">
      <h2 className="theme-font">{title}</h2>
      <span>{message}</span>
    </div>
  )
}

export default WaitingRoom
