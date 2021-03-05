import './QuestionOptions.css';
import Socket from '../../services/SocketService';

function QuestionOptions({count}) {
  const letters = [
    'A', 'B', 'C', 'D'
  ];

  function onSubmit(e) {
    e.preventDefault();
    let value = e.currentTarget.value;
    Socket.emit('selectOption', value);
    console.log('SELECTED: ', letters[value]);
    // disable the other buttons
  }

  let options = [];
  for (let i = 0; i < count; i++) {
    options.push(<button onClick={onSubmit} value={i}>{letters[i]}</button>);  
  }
  
  return (
    <div>
      {options}
    </div>
  )
}

export default QuestionOptions
