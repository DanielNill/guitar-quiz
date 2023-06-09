import { useState, useEffect } from 'react'
import { scaleNumbers, scaleModes, specificScaleModes, strings, basicFrets, advancedFrets } from './questions'

let questions = []
let answeredQuestions = []
export default function QuizPage({ timeLimit, questionCategories }) {
  const [question, setQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [counter, setCounter] = useState(timeLimit/1000)
  const [answersDisabled, setAnswersDisabled] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [questionsRemaining, setQuestionsRemaining] = useState(0)

  let qs = []
  questionCategories.forEach((cat) => {
    if (cat === 'scaleNumbers') {
      qs = qs.concat(scaleNumbers)
    } else if (cat === 'scaleModes') {
      qs = qs.concat(scaleModes)
    } else if (cat === 'specificScaleModes') {
      qs = qs.concat(specificScaleModes)
    } else if (cat === 'strings') {
      qs = qs.concat(strings)
    } else if (cat === 'basicFrets') {
      qs = qs.concat(basicFrets)
    } else if (cat === 'AdvancedFrets') {
      qs = qs.concat(AdvancedFrets)
    }
  })
  questions = qs.filter((q) => !answeredQuestions.includes(q.question))

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
    setTotalCount(totalCount + 1)
    if (answer === correctAnswer) {
      localStorage.setItem('correct', Number(localStorage.getItem('correct')) + 1)
      setIsCorrect(true)
      setAnswersDisabled(true)
      setCorrectCount(correctCount + 1)
      answeredQuestions.push(question)
      questions = questions.filter((q) => !answeredQuestions.includes(q.question))
      setQuestionsRemaining(questions.length)
      setTimeout(() => { getRandomQuestion() }, 2000)
    } else {
      handleWrongAnswer()
    }
  }

  const handleWrongAnswer = () => {
    setIsAnswered(true)
    setIsCorrect(false)
    setAnswersDisabled(true)
    localStorage.setItem('incorrect', Number(localStorage.getItem('incorrect')) + 1)
    setTimeout(() => { getRandomQuestion() }, 2000)
  }

  const endQuiz = () => {
    window.location.reload()
  }

  useEffect(() => {
    setQuestionsRemaining(questions.length)
    getRandomQuestion()
  }, [])

  useEffect(() => {
    if (counter > 0 && !isAnswered) {
      setTimeout(() => { setCounter(counter - 1) }, 1000)
    } else if (counter === 0 && !isAnswered) {
      setTotalCount(totalCount + 1)
      handleWrongAnswer()
    }
  }, [counter])

  return (
    <div>
      {!isAnswered && ( <div>Time Remaining: {counter}</div> )}
      {isAnswered && isCorrect && ( <div className="green">Correct!</div> )}
      {isAnswered && !isCorrect && ( <div className="red">Incorrect! The correct answer was {correctAnswer}</div> )}
      <div>Correct: {correctCount}/{totalCount}</div>
      <div>{questionsRemaining} questions remaining</div>
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

  

