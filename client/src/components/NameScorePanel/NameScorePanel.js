import './NameScorePanel.css';

function NameScorePanel({ name, score }) {
  return (
    <footer className="NameScorePanel-container">
      <span className="NameScorePanel-name">{ name }</span>
      {score !== null && score !== NaN && 
        <span className="NameScorePanel-score">{ score }</span>
      }
    </footer>
  )
}

export default NameScorePanel
