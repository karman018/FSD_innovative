import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'

const CAREER_COLORS = [
  'border-blue-400 bg-blue-50',
  'border-purple-400 bg-purple-50',
  'border-green-400 bg-green-50',
  'border-orange-400 bg-orange-50',
  'border-pink-400 bg-pink-50',
]

export default function CareerResult() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Hydrate from localStorage when navigating directly or after a page refresh
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('pathaiProfile') || 'null') } catch { return null }
  })()

  const result = state?.result ?? (saved ? { careers: saved.careers, skills_gap: saved.skills_gap, message: saved.message } : null)
  const formData = state?.formData ?? saved

  if (!result?.careers) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <AlertCircle className="text-red-400 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">No Results Found</h2>
        <p className="text-gray-500 mt-2">Please complete the onboarding first.</p>
        <button onClick={() => navigate('/onboarding')} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg">
          Go to Onboarding
        </button>
      </div>
    )
  }

  const { careers, skills_gap, message } = result

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <CheckCircle className="text-green-500 w-14 h-14 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Hey {formData?.name || 'there'}! Here are your career paths
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{message}</p>
      </div>

      {/* Career Cards */}
      <div className="space-y-4 mb-10">
        {careers?.map((career, i) => (
          <div key={i} className={`border-l-4 rounded-xl p-6 ${CAREER_COLORS[i % CAREER_COLORS.length]} shadow-sm`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">{career.title}</span>
                  <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full border text-gray-500 dark:text-gray-300 font-medium">
                    {career.match}% match
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{career.description}</p>
                <div className="flex flex-wrap gap-2">
                  {career.required_skills?.map((skill, j) => (
                    <span key={j} className="text-xs bg-white dark:bg-gray-700 px-3 py-1 rounded-full border dark:border-gray-600 text-gray-600 dark:text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/roadmap', { state: { career: career.title, formData } })}
              className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Roadmap <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Skills Gap */}
      {skills_gap?.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Skills to Develop</h3>
          <div className="flex flex-wrap gap-2">
            {skills_gap.map((skill, i) => (
              <span key={i} className="bg-yellow-100 dark:bg-yellow-800/40 text-yellow-700 dark:text-yellow-300 text-sm px-3 py-1 rounded-full border border-yellow-300 dark:border-yellow-600">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button onClick={() => navigate('/aptitude-test')} className="px-6 py-3 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
          Take Aptitude Test
        </button>
        <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">
          Start Over
        </button>
      </div>
    </div>
  )
}
