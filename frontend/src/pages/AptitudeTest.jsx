import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const QUESTIONS = [
  {
    id: 1, category: 'logical',
    question: 'If all roses are flowers and some flowers fade quickly, which statement is definitely true?',
    options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade quickly', 'All flowers are roses'],
    answer: 1
  },
  {
    id: 2, category: 'numerical',
    question: 'A shirt costs ₹500 after a 20% discount. What was the original price?',
    options: ['₹600', '₹625', '₹650', '₹700'],
    answer: 1
  },
  {
    id: 3, category: 'interest',
    question: 'Which activity would you enjoy most on a weekend?',
    options: ['Building an app or coding project', 'Analyzing market trends', 'Designing a creative poster', 'Helping people solve problems'],
    answer: null
  },
  {
    id: 4, category: 'logical',
    question: 'Complete the pattern: 2, 6, 12, 20, __',
    options: ['28', '30', '32', '36'],
    answer: 1
  },
  {
    id: 5, category: 'interest',
    question: 'You are given a complex problem. What is your first instinct?',
    options: ['Break it into smaller logical parts', 'Look at data and numbers', 'Think of a creative solution', 'Discuss with others'],
    answer: null
  },
  {
    id: 6, category: 'verbal',
    question: 'Choose the word most similar in meaning to "Pragmatic"',
    options: ['Idealistic', 'Practical', 'Emotional', 'Theoretical'],
    answer: 1
  },
  {
    id: 7, category: 'interest',
    question: 'Which subject did you enjoy most in school?',
    options: ['Mathematics / Computer Science', 'Economics / Commerce', 'Biology / Chemistry', 'History / Literature'],
    answer: null
  },
  {
    id: 8, category: 'numerical',
    question: 'If a train travels 300 km in 4 hours, how long will it take to travel 525 km?',
    options: ['6 hours', '7 hours', '6.5 hours', '7.5 hours'],
    answer: 1
  },
  {
    id: 9, category: 'interest',
    question: 'What kind of work environment do you prefer?',
    options: ['Working with computers and technology', 'Working with numbers and finance', 'Working with people and clients', 'Working on creative projects'],
    answer: null
  },
  {
    id: 10, category: 'logical',
    question: 'DOCTOR : HOSPITAL :: TEACHER : ?',
    options: ['Student', 'School', 'Book', 'Classroom'],
    answer: 1
  }
]

export default function AptitudeTest() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const selectAnswer = (qid, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qid]: optionIdx }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert('Please answer all questions before submitting.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/api/aptitude-result', { answers, questions: QUESTIONS })
      setResult(res.data)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert('Error connecting to backend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Your Aptitude Results</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Based on your answers, here's what we found:</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(result.scores || {}).map(([cat, score]) => (
              <div key={cat} className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{cat}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Recommended Career Direction</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.recommendation}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Get Detailed Career Paths →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Aptitude Test</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Answer all 10 questions to discover your strengths and best career fit.</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{Object.keys(answers).length} / {QUESTIONS.length} answered</p>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q, i) => (
          <div key={q.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <p className="font-semibold text-gray-800 dark:text-white mb-4">
              <span className="text-blue-600">Q{i + 1}.</span> {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => selectAnswer(q.id, j)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    answers[q.id] === j
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-8 bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing your answers...' : 'Submit & Get Results →'}
      </button>
    </div>
  )
}
