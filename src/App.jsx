import { useState, useEffect } from 'react'
import QuizPage from './QuizPage'
import './App.css'

function App() {
  const [startQuiz, setStartQuiz] = useState(false)
  const [timeLimit, setTimeLimit] = useState(localStorage.getItem('timeLimit') || 5000)
  const [scaleNumbers, setScaleNumbers] = useState(true)
  const [scaleQualities, setScaleQualities] = useState(false)
  const [specificScaleQualities, setSpecificScaleQualities] = useState(false)
  const questionCategoryOptions = ['scaleNumbers', 'scaleQualities', 'specificScaleQualities']

  const updateOptions = (e) => {
    if (e.target.type === 'range') {
      setTimeLimit(e.target.value)
    } else if (e.target.type === 'checkbox') {
      if (e.target.name === 'scaleNumbers') {
        setScaleNumbers(e.target.checked)
      } else if (e.target.name === 'scaleQualities') {
        setScaleQualities(e.target.checked)
      } else if (e.target.name === 'specificScaleQualities') {
        setSpecificScaleQualities(e.target.checked)
      }
    }
  }

  const clearStats = () => {
    if (confirm('Are you sure you want to clear your stats?') === true) {
      let correct = localStorage.getItem(`stats:${timeLimit}:correct`)
      let incorrect = localStorage.getItem(`stats:${timeLimit}:incorrect`)
      localStorage.removeItem(`stats:${timeLimit}:correct`)
      localStorage.removeItem(`stats:${timeLimit}:incorrect`)
      setTimeLimit(timeLimit + 1)
    }
  }

  const handleLaunchQuizClick = () => {
    if (!scaleNumbers && !scaleQualities && !specificScaleQualities) {
      alert('Please select at least one question category.')
      return
    }
    setStartQuiz(true)
  }

  if (startQuiz) {
    return (
      <QuizPage timeLimit={timeLimit} questionCategories={questionCategoryOptions.filter((cat) => eval(cat))}/>
    )
  } else {
    return (
      <div>
        <h1>Welcome to 🎸 Quiz!</h1>
        <p>Are you ready to rock?</p>
        <button onClick={handleLaunchQuizClick}>Launch Quiz</button>
        <div className="options-container">
          <p>Time Limit: { timeLimit/1000 } seconds</p>
          <input type="range" min="2000" max="10000" step="1000" value={ timeLimit } className="slider" id="myRange" onChange={updateOptions}/>
          {questionCategoryOptions.map((cat) => (
            <span key={cat}>
              <input type="checkbox" checked={eval(cat)} name={cat} value={cat} onChange={updateOptions} />
              <label htmlFor={cat}>{cat}</label><br></br>
            </span>
          ))}
        </div>
        <div className="stats-container">
          <h2>Stats</h2>
          <p>% Correct: { localStorage.getItem(`stats:${timeLimit}:correct`) / ((localStorage.getItem(`stats:${timeLimit}:correct`) + localStorage.getItem(`stats:${timeLimit}:incorrect`)) || 1) * 100 }</p>
          <p>Correct: { localStorage.getItem(`stats:${timeLimit}:correct`) }</p>
          <p>Incorrect: { localStorage.getItem(`stats:${timeLimit}:incorrect`) }</p>
          <button onClick={clearStats}>Clear Stats</button>
        </div>
      </div>
    );
  }
}

export default App
