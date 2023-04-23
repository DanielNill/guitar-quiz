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
  const [correct, setCorrect] = useState(localStorage.getItem('correct') || 0)
  const [incorrect, setIncorrect] = useState(localStorage.getItem('incorrect') || 0)
  const [streakChallenge, setStreakChallenge] = useState(Number(localStorage.getItem('streakChallenge')) || 0)

  const updateOptions = (e) => {
    if (e.target.name === 'timeLimit') {
      setTimeLimit(e.target.value)
    } else if (e.target.name === 'streakChallenge') {
      setStreakChallenge(e.target.value)
      localStorage.setItem('streakChallenge', e.target.value)
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
      localStorage.clear()
    }
  }

  const handleLaunchQuizClick = () => {
    if (!scaleNumbers && !scaleQualities && !specificScaleQualities) {
      alert('Please select at least one question category.')
      return
    }
    setStartQuiz(true)
  }

  useEffect(() => {
    setCorrect(localStorage.getItem('correct'))
    setIncorrect(localStorage.getItem('incorrect'))
  }, [localStorage.getItem('correct'), localStorage.getItem('incorrect')])

  if (startQuiz) {
    return (
      <QuizPage timeLimit={timeLimit} questionCategories={questionCategoryOptions.filter((cat) => eval(cat))} streakChallenge={streakChallenge}/>
    )
  } else {
    return (
      <div>
        <h1>Welcome to 🎸 Quiz!</h1>
        <p>Are you ready to rock?</p>
        <button onClick={handleLaunchQuizClick}>Launch Quiz</button>
        <div className="options-container">
          <p>Time Limit: { timeLimit/1000 } seconds</p>
          <input type="range" min="2000" max="10000" step="1000" value={ timeLimit } className="slider" name="timeLimit" onChange={updateOptions}/>
          <p>Streak Challenge: { streakChallenge } in a row</p>
          <input type="range" min="0" max="15" step="1" value={ streakChallenge } className="slider" name="streakChallenge" onChange={updateOptions}/>
          <p>Question Categories:</p>
          {questionCategoryOptions.map((cat) => (
            <span key={cat}>
              <input type="checkbox" checked={eval(cat)} name={cat} value={cat} onChange={updateOptions} />
              <label htmlFor={cat}>{cat}</label><br></br>
            </span>
          ))}
        </div>
        <div className="stats-container">
          <h2>Stats</h2>
          <p> %: { Math.round((Number(correct) / (Number(correct) + Number(incorrect))) * 100) } </p>
          <p>Correct: { correct || 0 }</p>
          <p>Incorrect: { incorrect || 0 }</p>
          <button onClick={clearStats}>Clear Stats</button>
        </div>
      </div>
    );
  }
}

export default App
