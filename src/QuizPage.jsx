import { useState, useEffect } from 'react'
import { scaleNumbers, scaleQualities, specificScaleQualities } from './questions'

export default function QuizPage({ timeLimit, questionCategories }) {
  const [question, setQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [counter, setCounter] = useState(timeLimit/1000)
  const [answersDisabled, setAnswersDisabled] = useState(false)
  let questions = []
  questionCategories.forEach((cat) => {
    if (cat === 'scaleNumbers') {
      questions = questions.concat(scaleNumbers)
    } else if (cat === 'scaleQualities') {
      questions = questions.concat(scaleQualities)
    } else if (cat === 'specificScaleQualities') {
      questions = questions.concat(specificScaleQualities)
    }
  })

  const getRandomQuestion = () => {
    const question = questions[Math.floor(Math.random() * questions.length)]
    setQuestion(question.question)
    setCorrectAnswer(question.correctAnswer)
    setOptions(question.answers)
    setIsAnswered(false)
    setIsCorrect(null)
    setAnswersDisabled(false)
    setCounter(timeLimit/1000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsAnswered(true)
    let answer = e.target.value
    if (answer === correctAnswer) {
      localStorage.setItem(`stats:${timeLimit}:correct`, Number(localStorage.getItem(`stats:${timeLimit}:correct`)) + 1)
      setIsCorrect(true)
      setAnswersDisabled(true)
      setTimeout(() => { getRandomQuestion() }, 2000)
    } else {
      handleWrongAnswer()
    }
  }

  const handleWrongAnswer = () => {
    setIsAnswered(true)
    setIsCorrect(false)
    setAnswersDisabled(true)
    localStorage.setItem(`stats:${timeLimit}:incorrect`, Number(localStorage.getItem(`stats:${timeLimit}:incorrect`)) + 1)
    setTimeout(() => { getRandomQuestion() }, 2000)
  }

  const endQuiz = () => {
    window.location.reload()
  }

  useEffect(() => {
    getRandomQuestion()
  }, [])

  useEffect(() => {
    if (counter > 0 && !isAnswered) {
      setTimeout(() => { setCounter(counter - 1) }, 1000)
    } else if (counter === 0 && !isAnswered) {
      handleWrongAnswer()
    }
  }, [counter])

  return (
    <div>
      {!isAnswered && ( <div>Time Remaining: {counter}</div> )}
      {isAnswered && isCorrect && ( <div className="green">Correct!</div> )}
      {isAnswered && !isCorrect && ( <div className="red">Incorrect! The correct answer was {correctAnswer}</div> )}

      <div><h2>{question}</h2></div>
      <span className="buttons-container">
        {options.map((ans) => (
          <div key={ans}>
            <button className="answer-button" disabled={answersDisabled} name="answer" value={ans} onClick={handleSubmit}>{ans}</button>
          </div>
        ))}
      </span>
      <button onClick={endQuiz}>End Quiz</button>
    </div>
  )
}

  

