import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import {
  GraduationCap, Target, BookOpen, Briefcase, Award,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Send, Bot, User, Lightbulb
} from 'lucide-react'

const YEAR_ROADMAP = {
  '1st Year': {
    color: 'blue',
    focus: 'Foundation & Exploration',
    tasks: [
      { id: 1, text: 'Learn programming basics (C++/Python/Java)', done: false },
      { id: 2, text: 'Join 1-2 college clubs or technical societies', done: false },
      { id: 3, text: 'Complete one free online course (Coursera/NPTEL)', done: false },
      { id: 4, text: 'Create a LinkedIn profile', done: false },
      { id: 5, text: 'Attend college tech fests and events', done: false },
      { id: 6, text: 'Explore different career fields through YouTube/podcasts', done: false },
    ],
    tip: 'Focus on learning and exploring — this year is about building a strong base.',
    resources: [
      { name: 'CS50 by Harvard (Free)', url: 'https://cs50.harvard.edu' },
      { name: 'NPTEL Courses', url: 'https://nptel.ac.in' },
      { name: 'GitHub Student Pack', url: 'https://education.github.com' },
    ]
  },
  '2nd Year': {
    color: 'green',
    focus: 'Skill Building & Projects',
    tasks: [
      { id: 1, text: 'Build 1-2 personal projects and put them on GitHub', done: false },
      { id: 2, text: 'Learn Data Structures & Algorithms (DSA)', done: false },
      { id: 3, text: 'Get 1 certification (AWS, Google, or relevant)', done: false },
      { id: 4, text: 'Participate in a hackathon', done: false },
      { id: 5, text: 'Start solving problems on LeetCode/Codeforces', done: false },
      { id: 6, text: 'Connect with seniors and professionals on LinkedIn', done: false },
    ],
    tip: 'Projects speak louder than marks. Start building real things this year.',
    resources: [
      { name: 'LeetCode', url: 'https://leetcode.com' },
      { name: 'Devfolio Hackathons', url: 'https://devfolio.co' },
      { name: 'freeCodeCamp', url: 'https://freecodecamp.org' },
    ]
  },
  '3rd Year': {
    color: 'purple',
    focus: 'Internships & Career Clarity',
    tasks: [
      { id: 1, text: 'Apply for summer internships (at least 20 companies)', done: false },
      { id: 2, text: 'Build a strong resume (1 page, ATS friendly)', done: false },
      { id: 3, text: 'Do a major project aligned with your career goal', done: false },
      { id: 4, text: 'Get active on LinkedIn — post about your projects', done: false },
      { id: 5, text: 'Prepare for technical interviews (DSA + system design)', done: false },
      { id: 6, text: 'Explore higher studies (GRE/GMAT/CAT) if interested', done: false },
    ],
    tip: 'This is your most important year. Internship + project = strong placement profile.',
    resources: [
      { name: 'Internshala', url: 'https://internshala.com' },
      { name: 'LinkedIn Jobs', url: 'https://linkedin.com/jobs' },
      { name: 'Naukri Campus', url: 'https://campus.naukri.com' },
    ]
  },
  '4th Year': {
    color: 'orange',
    focus: 'Placements & Final Push',
    tasks: [
      { id: 1, text: 'Prepare for campus placement drives', done: false },
      { id: 2, text: 'Practice 50+ mock interview questions', done: false },
      { id: 3, text: 'Finalize and polish your portfolio/GitHub', done: false },
      { id: 4, text: 'Apply off-campus to 30+ companies', done: false },
      { id: 5, text: 'Prepare for HR rounds and salary negotiation', done: false },
      { id: 6, text: 'Decide: job vs higher studies vs startup', done: false },
    ],
    tip: 'Be consistent. Apply everywhere. One yes is all you need!',
    resources: [
      { name: 'GeeksforGeeks Placement', url: 'https://geeksforgeeks.org/placements' },
      { name: 'PrepInsta', url: 'https://prepinsta.com' },
      { name: 'AmbitionBox', url: 'https://ambitionbox.com' },
    ]
  },
  'Post Graduate': {
    color: 'pink',
    focus: 'Specialization & Research',
    tasks: [
      { id: 1, text: 'Define your research/specialization area', done: false },
      { id: 2, text: 'Publish or contribute to a research paper', done: false },
      { id: 3, text: 'Build industry connections through conferences', done: false },
      { id: 4, text: 'Apply for internships / research assistantships', done: false },
      { id: 5, text: 'Explore PhD or industry roles', done: false },
      { id: 6, text: 'Build a strong academic + professional portfolio', done: false },
    ],
    tip: 'Your network and research quality will define your opportunities.',
    resources: [
      { name: 'Google Scholar', url: 'https://scholar.google.com' },
      { name: 'ResearchGate', url: 'https://researchgate.net' },
      { name: 'LinkedIn Research Jobs', url: 'https://linkedin.com' },
    ]
  }
}

// Roadmap data for non-college users (10th, 12th, graduate)
const STAGE_ROADMAP = {
  '10th': {
    color: 'blue',
    focus: 'Stream Selection & Foundation',
    label: 'After 10th',
    tasks: [
      { id: 1, text: 'Research Science, Commerce and Arts streams thoroughly', done: false },
      { id: 2, text: 'Talk to seniors and parents about stream options', done: false },
      { id: 3, text: 'Explore career options for each stream', done: false },
      { id: 4, text: 'Identify your strongest subjects', done: false },
      { id: 5, text: 'Start basic digital skills (typing, internet, spreadsheets)', done: false },
      { id: 6, text: 'Explore free online courses on Coursera or Khan Academy', done: false },
    ],
    tip: 'Choose your stream based on your genuine interests, not just peer pressure. It shapes your next 10 years.',
    resources: [
      { name: 'Khan Academy (Free)', url: 'https://khanacademy.org' },
      { name: 'Coursera Explore', url: 'https://coursera.org/browse' },
      { name: 'Shiksha.com Career Guide', url: 'https://shiksha.com' },
    ]
  },
  '12th': {
    color: 'green',
    focus: 'College & Entrance Exam Prep',
    label: 'After 12th',
    tasks: [
      { id: 1, text: 'Shortlist colleges based on your stream and interests', done: false },
      { id: 2, text: 'Register and prepare for entrance exams (JEE/NEET/CLAT/CUET)', done: false },
      { id: 3, text: 'Create a college application tracker', done: false },
      { id: 4, text: 'Explore scholarship opportunities', done: false },
      { id: 5, text: 'Build a basic resume with your achievements', done: false },
      { id: 6, text: 'Research different career paths in your field', done: false },
    ],
    tip: 'Apply to at least 8-10 colleges. Keep backup options ready alongside your dream college.',
    resources: [
      { name: 'Collegedunia', url: 'https://collegedunia.com' },
      { name: 'JEE/NEET Prep - Unacademy', url: 'https://unacademy.com' },
      { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
    ]
  },
  'graduate': {
    color: 'orange',
    focus: 'Job Search & Career Launch',
    label: 'Graduate',
    tasks: [
      { id: 1, text: 'Polish your resume — keep it 1 page, ATS-friendly', done: false },
      { id: 2, text: 'Optimise your LinkedIn profile with skills and projects', done: false },
      { id: 3, text: 'Apply to 30+ companies on Naukri, LinkedIn and company sites', done: false },
      { id: 4, text: 'Prepare for technical + HR interview rounds', done: false },
      { id: 5, text: 'Consider upskilling through certifications', done: false },
      { id: 6, text: 'Explore higher studies options (MBA/MS/PG Diploma)', done: false },
    ],
    tip: 'Job searching is a numbers game. Keep applying consistently and follow up on applications.',
    resources: [
      { name: 'Naukri.com', url: 'https://naukri.com' },
      { name: 'LinkedIn Jobs', url: 'https://linkedin.com/jobs' },
      { name: 'AmbitionBox Salary Insights', url: 'https://ambitionbox.com' },
    ]
  }
}

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', btn: 'bg-green-600 hover:bg-green-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', btn: 'bg-pink-600 hover:bg-pink-700' },
}

export default function Assistant() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showResources, setShowResources] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('pathaiProfile')
    if (!saved) { navigate('/onboarding'); return }
    const p = JSON.parse(saved)
    setProfile(p)

    // Pick roadmap data based on stage — college users get year-based, others get stage-based
    const isCollege = p.stage === 'college'
    const storageKey = isCollege ? `tasks_${p.current_year}` : `tasks_stage_${p.stage}`
    const yearData = isCollege
      ? (YEAR_ROADMAP[p.current_year] || YEAR_ROADMAP['1st Year'])
      : (STAGE_ROADMAP[p.stage] || STAGE_ROADMAP['graduate'])

    // Load tasks from localStorage or use default
    const savedTasks = localStorage.getItem(storageKey)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks(yearData.tasks)
    }

    // Set initial chat message
    const stageLabel = isCollege ? p.current_year : (STAGE_ROADMAP[p.stage]?.label || p.stage)
    setMessages([{
      role: 'bot',
      text: `Hey ${p.name || 'there'}! 👋 I'm your Personal PathAI Assistant.\n\nYour focus: **${yearData.focus}**\n\nAsk me anything — careers, skills, exams, or your next steps!`
    }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(updated)
    if (profile) {
      const isCollege = profile.stage === 'college'
      const storageKey = isCollege ? `tasks_${profile.current_year}` : `tasks_stage_${profile.stage}`
      localStorage.setItem(storageKey, JSON.stringify(updated))
    }
  }

  const sendMessage = async () => {
    const msg = input.trim()
    if (!msg || chatLoading) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setChatLoading(true)

    try {
      const context = profile ? `Student: ${profile.name}, ${profile.current_year} at ${profile.college_name}, studying ${profile.branch}. Career goal: ${profile.career_goal || 'not specified'}. Interests: ${(profile.interests || []).join(', ')}.` : ''
      const res = await api.post('/api/chat', {
        message: `[Context: ${context}]\n\nStudent question: ${msg}`
      })
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, unable to connect right now.' }])
    } finally {
      setChatLoading(false)
    }
  }

  if (!profile) return null

  const isCollege = profile.stage === 'college'
  const yearData = isCollege
    ? (YEAR_ROADMAP[profile.current_year] || YEAR_ROADMAP['1st Year'])
    : (STAGE_ROADMAP[profile.stage] || STAGE_ROADMAP['graduate'])
  const colors = COLOR_MAP[yearData.color]
  const doneTasks = tasks.filter(t => t.done).length
  const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0

  // Subtitle line under name differs by stage
  const profileSubtitle = isCollege
    ? `${profile.branch} • ${profile.college_name} • ${profile.current_year}`
    : `${profile.branch || profile.stage} • ${yearData.label}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6 mb-6`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {profile.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-500 mt-1">{profileSubtitle}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
              🎯 {yearData.focus}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Year Progress</p>
            <p className="text-3xl font-bold text-gray-800">{progress}%</p>
            <p className="text-xs text-gray-400">{doneTasks}/{tasks.length} tasks done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-3 mt-4">
          <div className={`h-3 rounded-full transition-all duration-500 ${colors.btn.split(' ')[0]}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Tasks */}
        <div className="md:col-span-2 space-y-4">
          {/* Tip */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
            <Lightbulb className="text-yellow-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{yearData.tip}</p>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Your {isCollege ? profile.current_year : yearData.label} Checklist
            </h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {task.done
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  }
                  <span className={`text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <button
              onClick={() => setShowResources(r => !r)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Recommended Resources
              </h2>
              {showResources ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {showResources && (
              <div className="mt-4 space-y-2">
                {yearData.resources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline text-sm p-2 hover:bg-blue-50 rounded-lg">
                    <Award className="w-4 h-4" />
                    {r.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Stats + Chat */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Your Profile
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Career Goal</span>
                <span className="font-medium text-gray-700 text-right">{profile.career_goal || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Top Interest</span>
                <span className="font-medium text-gray-700">{profile.interests?.[0] || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stage</span>
                <span className="font-medium text-gray-700">{isCollege ? profile.current_year : yearData.label}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full mt-4 text-xs text-blue-600 hover:underline"
            >
              Update Profile →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: '📄 Build Resume Tips', msg: 'Give me tips to build a strong resume for placements' },
                { label: '💼 Find Internships', msg: `Best platforms to find internships for ${profile.branch} students in India` },
                { label: '🧠 Interview Prep', msg: 'How should I prepare for technical interviews?' },
                { label: '🚀 Project Ideas', msg: `Suggest 3 project ideas for a ${profile.branch} ${profile.current_year} student` },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(action.msg)
                    setChatOpen(true)
                  }}
                  className="w-full text-left text-sm px-3 py-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(o => !o)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 z-50"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100" style={{ height: '480px' }}>
          <div className="bg-purple-600 text-white px-4 py-3 rounded-t-2xl flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div>
              <p className="font-semibold text-sm">Your College Assistant</p>
              <p className="text-xs text-purple-200">Personalized for {profile.name}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ask your assistant..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button onClick={sendMessage} disabled={chatLoading || !input.trim()} className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
