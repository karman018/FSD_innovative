import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { CheckSquare, ExternalLink, AlertCircle } from 'lucide-react'

export default function Roadmap() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate career + formData from localStorage when state is lost on refresh
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('pathaiProfile') || 'null') } catch { return null }
  })()

  const career = state?.career
  const formData = state?.formData ?? saved

  useEffect(() => {
    if (!career) {
      navigate('/onboarding')
      return
    }
    api.post('/api/roadmap', { career, formData })
      .then(res => setRoadmap(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [career])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Building your personalized roadmap...</p>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <AlertCircle className="text-red-400 w-12 h-12 mb-3" />
        <p className="text-gray-600 dark:text-gray-400">Could not load roadmap. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Your Roadmap to become a <span className="text-blue-600">{career}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{roadmap.overview}</p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-blue-200 dark:border-blue-800 pl-6 space-y-8 mb-10">
        {roadmap.phases?.map((phase, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-gray-900" />
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {phase.duration}
                </span>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">{phase.title}</h3>
              </div>
              <ul className="space-y-2">
                {phase.tasks?.map((task, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckSquare className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Resources */}
      {roadmap.resources?.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Recommended Resources</h3>
          <div className="space-y-3">
            {roadmap.resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                {r.name} — <span className="text-gray-500 dark:text-gray-400">{r.type}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/career-result')}
          className="px-6 py-3 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          ← Back to Career Results
        </button>
      </div>
    </div>
  )
}
