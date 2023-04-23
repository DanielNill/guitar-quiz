import { useState, useEffect } from 'react'
import QuizPage from './QuizPage'
import './App.css'

function App() {
  const [startQuiz, setStartQuiz] = useState(false)
  const [timeLimit, setTimeLimit] = useState(localStorage.getItem('timeLimit') || 5000)
  const [questionCategories, setQuestionCategories] = useState(['scaleNumbers'])


  const updateOptions = (e) => {
    if (e.target.type === 'range') {
      setTimeLimit(e.target.value)
    } else if (e.target.type === 'checkbox') {
      if (e.target.checked) {
        setQuestionCategories([...questionCategories, e.target.value])
      } else {
        setQuestionCategories(questionCategories.filter((cat) => cat !== e.target.value))
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
    if (questionCategories.length === 0) {
      alert('Please select at least one question category.')
      return
    }
    setStartQuiz(true)
  }

  if (startQuiz) {
    return (
      <QuizPage timeLimit={timeLimit} questionCategories={questionCategories} />
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
          <input type="checkbox" checked={questionCategories.includes('scaleNumbers')} name="scale-numbers" value="scaleNumbers" onChange={updateOptions} />
          <label htmlFor="scale-numbers">Scale Numbers</label><br></br>
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
