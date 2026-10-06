import { useNavigate } from 'react-router-dom'
import { Compass, Brain, BookOpen, MessageCircle } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 text-center bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
            <Compass className="text-blue-600 dark:text-blue-400 w-12 h-12" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to <span className="text-blue-600 dark:text-blue-400">PathAI</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
          Your AI-powered career guidance platform. Discover the right career path
          based on your background, skills, and interests.
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Start Your Journey →
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full px-4">
        <FeatureCard
          icon={<Brain className="text-purple-600 w-8 h-8" />}
          bg="bg-purple-100"
          title="AI Career Prediction"
          desc="Our ML model analyzes your academic history and interests to suggest the best career paths."
        />
        <FeatureCard
          icon={<BookOpen className="text-green-600 w-8 h-8" />}
          bg="bg-green-100"
          title="Aptitude Test"
          desc="Not sure what you want? Take our aptitude test and let us help you discover your strengths."
        />
        <FeatureCard
          icon={<MessageCircle className="text-orange-600 w-8 h-8" />}
          bg="bg-orange-100"
          title="AI Chatbot"
          desc="Ask anything about careers, skills, or your roadmap. Our AI assistant is always here to help."
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, bg, title, desc }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-left hover:shadow-lg transition-shadow">
      <div className={`${bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  )
}
