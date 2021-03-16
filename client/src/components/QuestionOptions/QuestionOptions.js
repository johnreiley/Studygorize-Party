import './QuestionOptions.css';
import { useState } from 'react';
import Socket from '../../services/SocketService';
import QuestionOption from './QuestionOption/QuestionOption';

function QuestionOptions({count}) {
  const [selectedOption, setSelectedOption] = useState(undefined);
  const letters = [
    'A', 'B', 'C', 'D'
  ];
  const colors = [
    'red', 'purple', 'green', 'yellow'
  ];

  function onSubmit(e) {
    e.preventDefault();
    let value = parseInt(e.currentTarget.value);
    setSelectedOption(value);
    Socket.emit('selectOption', value);
  }

  let options = [];
  for (let i = 0; i < count; i++) {
    options.push(<QuestionOption 
      onClick={onSubmit} 
      value={i} 
      letter={letters[i]} 
      color={(selectedOption === undefined || selectedOption === i) ? colors[i] : 'gray'}
      isSelected={selectedOption === i} 
      disabled={selectedOption !== undefined} />
    );  
  }
  
  return (
    <div className="QuestionOptions-container">
      <div className="QuestionOptions-options-container">
        {options}
      </div>
    </div>
  )
}

export default QuestionOptions
