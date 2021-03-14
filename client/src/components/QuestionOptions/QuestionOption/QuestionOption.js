import './QuestionOption.css';

function QuestionOption({letter, value, color, disabled, onClick}) {

  let className = `text-${color} theme-font QuestionOption`;

  return (
    <button className={className} onClick={onClick} value={value} disabled={disabled}>
      {letter}
    </button>
  )
}

export default QuestionOption;
