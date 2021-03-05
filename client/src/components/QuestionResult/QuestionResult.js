import './QuestionResult.css';

function QuestionResult({isCorrect, score}) {

  let text = isCorrect ? 'Correct!' : 'Incorrect!';
  let icon = isCorrect ? 'check' : 'close';
  let className = isCorrect ? 'bg-success' : 'bg-danger';
  className += " QuestionResult-container";

  return (
    <div className={className}>
      <h2 className="QuestionResult-text">{text}</h2>
      <div className="QuestionResult-icon">
        <i className="material-icons">{icon}</i>
      </div>
      <span className="QuestionResult-points">+{score}</span>
    </div>
  )
}

export default QuestionResult;
