import './QuestionOption.css';

function QuestionOption({letter, value, color, disabled, isSelected, onClick}) {

  let className = `text-${color} theme-font QuestionOption`;
  if (disabled && isSelected) {
    className += " selected";
  } else if (disabled && !isSelected) {
    className += " unselected";
  }

  return (
    <button className={className} onClick={onClick} value={value} disabled={disabled}>
      {letter}
    </button>
  )
}

export default QuestionOption;
