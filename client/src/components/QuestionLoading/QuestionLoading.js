import './QuestionLoading.css';

function QuestionLoading() {
  return (
    <div className="QuestionLoading-container">
      <div className="spinner-custom spinner-border mb-2" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <h3 className="text-light">Get Ready!</h3>
    </div>
  )
}

export default QuestionLoading
