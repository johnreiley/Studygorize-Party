import './PartyResults.css';

function PartyResults({ score }) {
  return (
    <div className="PartyResults">
      <h1 className="theme-font">You scored:</h1>
      <h2>{score} {score === 1 ? 'point' : 'points'}</h2>
    </div>
  )
}

export default PartyResults;
