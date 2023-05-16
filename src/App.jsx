import { useState, useEffect } from 'react'
import QuizPage from './QuizPage'
import './App.css'

function App() {
  const [startQuiz, setStartQuiz] = useState(false)
  const [timeLimit, setTimeLimit] = useState(localStorage.getItem('timeLimit') || 7000)

  const [scaleNumbers, setScaleNumbers] = useState(true)
  const [basicFrets, setBasicFrets] = useState(true)
  const [advancedFrets, setAdvancedFrets] = useState(true)
  const [scaleModes, setScaleModes] = useState(true)
  const [specificScaleModes, setSpecificScaleModes] = useState(true)
  const [strings, setStrings] = useState(true)

  const [correct, setCorrect] = useState(localStorage.getItem('correct') || 0)
  const [incorrect, setIncorrect] = useState(localStorage.getItem('incorrect') || 0)
  const questionCategoryOptions = ['scaleNumbers', 'scaleModes', 'specificScaleModes', 'strings', 'basicFrets', 'advancedFrets'];

  const updateOptions = (e) => {
    if (e.target.name === 'timeLimit') {
      setTimeLimit(e.target.value)
    } else if (e.target.type === 'checkbox') {
      if (e.target.name === 'scaleNumbers') {
        setScaleNumbers(e.target.checked)
      } else if (e.target.name === 'scaleModes') {
        setScaleModes(e.target.checked)
      } else if (e.target.name === 'specificScaleModes') {
        setSpecificScaleModes(e.target.checked)
      } else if (e.target.name === 'strings') {
        setStrings(e.target.checked)
      } else if (e.target.name === 'basicFrets') {
        setBasicFrets(e.target.checked)
      } else if (e.target.name === 'advancedFrets') {
        setAdvancedFrets(e.target.checked)
      }
    }
  }

  const clearStats = () => {
    if (confirm('Are you sure you want to clear your stats?') === true) {
      localStorage.clear()
    }
  }

  const handleLaunchQuizClick = () => {
    if (!scaleNumbers && !scaleQualities && !specificScaleQualities && !strings) {
      alert('Please select at least one question category.')
      return
    }
    setStartQuiz(true)
  }

  const titlize = (str) => {
    str = str.replace(/([A-Z])/g, ' $1')
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const getCategoryValue = (cat) => {
    switch (cat) {
      case 'scaleNumbers':
        return scaleNumbers
      case 'scaleModes':
        return scaleModes
      case 'specificScaleModes':
        return specificScaleModes
      case 'strings':
        return strings
      case 'basicFrets':
        return basicFrets
      case 'advancedFrets':
        return advancedFrets
      default:
        return false
    }
  }

  useEffect(() => {
    setCorrect(localStorage.getItem('correct'))
    setIncorrect(localStorage.getItem('incorrect'))
  }, [localStorage.getItem('correct'), localStorage.getItem('incorrect')])

  if (startQuiz) {
    return (
      <QuizPage timeLimit={timeLimit} questionCategories={questionCategoryOptions.filter((cat) => getCategoryValue(cat))}/>
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
          <p>Question Categories:</p>
          {questionCategoryOptions.map((cat) => (
            <span key={cat}>
              <input type="checkbox" checked={getCategoryValue(cat)} name={cat} value={cat} onChange={updateOptions} />
              <label htmlFor={cat}>{titlize(cat)}</label><br></br>
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
