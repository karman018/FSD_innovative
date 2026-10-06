import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { GraduationCap, BookOpen, Building2, Briefcase } from 'lucide-react'

const STAGES = [
  { id: '10th', icon: <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />, bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700', title: 'Just passed 10th', desc: 'Choosing stream, planning for 11th & 12th' },
  { id: '12th', icon: <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />, bg: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700', title: 'Just passed 12th', desc: 'Looking for colleges, entrance exams, career paths' },
  { id: 'college', icon: <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />, bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700', title: 'Currently in College', desc: 'Need guidance for internships, projects, placements' },
  { id: 'graduate', icon: <Briefcase className="w-8 h-8 text-orange-600 dark:text-orange-400" />, bg: 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700', title: 'College Graduate', desc: 'Looking for jobs, higher studies, or career switch' }
]

const INTERESTS = ['Technology', 'Business', 'Design', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Law', 'Engineering', 'Arts & Media']
const SKILLS = ['Programming', 'Data Analysis', 'Communication', 'Problem Solving', 'Leadership', 'Creative Thinking', 'Mathematics', 'Research', 'Management']
const STREAMS = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts / Humanities']
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate']

// Validators
const isValidPct = v => v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100
const isValidName = v => v.trim().length >= 2 && /^[a-zA-Z\s'\-]+$/.test(v.trim())
const isValidText = v => v.trim().length >= 1

export default function Onboarding() {
  const navigate = useNavigate()
  const [stage, setStage] = useState(null)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})
  const [form, setForm] = useState({
    name: '', stage: '',
    tenth_board: '', tenth_percentage: '',
    twelfth_stream: '', twelfth_percentage: '',
    current_year: '', college_name: '', branch: '',
    interests: [], skills: [], career_goal: ''
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }))
  const toggleMulti = (field, value) => setForm(prev => {
    const arr = prev[field]
    return { ...prev, [field]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value] }
  })

  const selectStage = (s) => { setStage(s.id); setForm(prev => ({ ...prev, stage: s.id })); setStep(1) }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.post('/api/predict-career', form)
      localStorage.setItem('pathaiProfile', JSON.stringify({ ...form, ...res.data }))
      navigate('/career-result', { state: { result: res.data, formData: form } })
    } catch (err) {
      alert('Something went wrong. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (!stage) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Where are you right now?</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">We'll personalize your experience based on your current stage</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STAGES.map(s => (
            <button key={s.id} onClick={() => selectStage(s)} className={`${s.bg} border-2 rounded-2xl p-6 text-left hover:shadow-md transition-all`}>
              <div className="mb-3">{s.icon}</div>
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">{s.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{s.desc}</p>
            </button>          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Not sure?{' '}<a href="/aptitude-test" className="text-blue-600 hover:underline font-medium">Take the Aptitude Test</a>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => { setStage(null); setStep(0); setTouched({}) }} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-4">← Change stage</button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
        {stage === '10th'     && <TenthFlow    step={step} setStep={setStep} form={form} update={update} touch={touch} touched={touched} toggleMulti={toggleMulti} loading={loading} onSubmit={handleSubmit} />}
        {stage === '12th'     && <TwelfthFlow  step={step} setStep={setStep} form={form} update={update} touch={touch} touched={touched} toggleMulti={toggleMulti} loading={loading} onSubmit={handleSubmit} />}
        {stage === 'college'  && <CollegeFlow  step={step} setStep={setStep} form={form} update={update} touch={touch} touched={touched} toggleMulti={toggleMulti} loading={loading} onSubmit={handleSubmit} navigate={navigate} />}
        {stage === 'graduate' && <GraduateFlow step={step} setStep={setStep} form={form} update={update} touch={touch} touched={touched} toggleMulti={toggleMulti} loading={loading} onSubmit={handleSubmit} />}
      </div>
    </div>
  )
}

// ─── 10th Flow ────────────────────────────────────────────────────
function TenthFlow({ step, setStep, form, update, touch, touched, toggleMulti, loading, onSubmit }) {
  const pctOk = isValidPct(form.tenth_percentage)
  return (
    <>
      {step === 1 && (
        <FlowStep title="Tell us about yourself"
          onNext={() => setStep(2)}
          nextDisabled={!isValidName(form.name) || !form.tenth_board || !pctOk}>
          <TF label="Your Name" error={touched.name && !isValidName(form.name) ? "Enter a valid name (min 2 characters)" : ''}>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} onBlur={() => touch('name')} placeholder="Enter your name" className={inp(touched.name && !isValidName(form.name))} />
          </TF>
          <TF label="10th Board" error={touched.tenth_board && !form.tenth_board ? 'Please select your board' : ''}>
            <select value={form.tenth_board} onChange={e => update('tenth_board', e.target.value)} onBlur={() => touch('tenth_board')} className={inp(touched.tenth_board && !form.tenth_board)}>
              <option value="">Select Board</option>
              {['CBSE', 'ICSE', 'State Board', 'IB'].map(b => <option key={b}>{b}</option>)}
            </select>
          </TF>
          <PctField label="10th Percentage / CGPA" value={form.tenth_percentage} onChange={v => update('tenth_percentage', v)} touched={touched.tenth_percentage} onBlur={() => touch('tenth_percentage')} />
        </FlowStep>
      )}
      {step === 2 && (
        <FlowStep title="What are your interests?" onNext={() => setStep(3)} onBack={() => setStep(1)} nextDisabled={form.interests.length === 0}>
          <InterestPicker form={form} toggleMulti={toggleMulti} />
          {form.interests.length === 0 && <p className="text-red-500 text-xs mt-2">⚠️ Please select at least one interest</p>}
        </FlowStep>
      )}
      {step === 3 && (
        <FlowStep title="Any career goal in mind?" onNext={onSubmit} onBack={() => setStep(2)} nextLabel={loading ? 'Analyzing...' : 'Get Career Guidance →'} nextDisabled={loading}>
          <TF label="Career Goal (optional)" error="">
            <input type="text" value={form.career_goal} onChange={e => update('career_goal', e.target.value)} placeholder="e.g. Engineer, Doctor, Designer..." className={inp(false)} />
          </TF>
          <SkillPicker form={form} toggleMulti={toggleMulti} />
        </FlowStep>
      )}
    </>
  )
}

// ─── 12th Flow ────────────────────────────────────────────────────
function TwelfthFlow({ step, setStep, form, update, touch, touched, toggleMulti, loading, onSubmit }) {
  const tenth_ok = isValidPct(form.tenth_percentage)
  const twelfth_ok = form.twelfth_percentage === '' || isValidPct(form.twelfth_percentage)
  return (
    <>
      {step === 1 && (
        <FlowStep title="Your academic details"
          onNext={() => setStep(2)}
          nextDisabled={!isValidName(form.name) || !form.twelfth_stream || !tenth_ok || !twelfth_ok}>
          <TF label="Your Name" error={touched.name && !isValidName(form.name) ? "Enter a valid name (min 2 characters)" : ''}>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} onBlur={() => touch('name')} placeholder="Enter your name" className={inp(touched.name && !isValidName(form.name))} />
          </TF>
          <PctField label="10th Percentage" value={form.tenth_percentage} onChange={v => update('tenth_percentage', v)} touched={touched.tenth_percentage} onBlur={() => touch('tenth_percentage')} />
          <TF label="12th Stream" error={touched.twelfth_stream && !form.twelfth_stream ? 'Please select your stream' : ''}>
            <select value={form.twelfth_stream} onChange={e => update('twelfth_stream', e.target.value)} onBlur={() => touch('twelfth_stream')} className={inp(touched.twelfth_stream && !form.twelfth_stream)}>
              <option value="">Select Stream</option>
              {STREAMS.map(s => <option key={s}>{s}</option>)}
            </select>
          </TF>
          <PctField label="12th Percentage" value={form.twelfth_percentage} onChange={v => update('twelfth_percentage', v)} touched={touched.twelfth_percentage} onBlur={() => touch('twelfth_percentage')} required={false} />
        </FlowStep>
      )}
      {step === 2 && (
        <FlowStep title="Your interests & career goal" onNext={onSubmit} onBack={() => setStep(1)} nextLabel={loading ? 'Analyzing...' : 'Get Career Paths →'} nextDisabled={loading || form.interests.length === 0}>
          <InterestPicker form={form} toggleMulti={toggleMulti} />
          {form.interests.length === 0 && <p className="text-red-500 text-xs mt-2">⚠️ Please select at least one interest</p>}
          <div className="mt-4">
            <TF label="Career Goal (optional)" error="">
              <input type="text" value={form.career_goal} onChange={e => update('career_goal', e.target.value)} placeholder="e.g. Data Scientist, Product Manager..." className={inp(false)} />
            </TF>
          </div>
          <SkillPicker form={form} toggleMulti={toggleMulti} />
        </FlowStep>
      )}
    </>
  )
}

// ─── College Flow ─────────────────────────────────────────────────
function CollegeFlow({ step, setStep, form, update, touch, touched, toggleMulti, loading, onSubmit, navigate }) {
  return (
    <>
      {step === 1 && (
        <FlowStep title="Tell us about yourself"
          onNext={() => setStep(2)}
          nextDisabled={!isValidName(form.name) || !isValidText(form.branch) || !form.current_year}>
          <TF label="Your Name" error={touched.name && !isValidName(form.name) ? "Enter a valid name (min 2 characters)" : ''}>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} onBlur={() => touch('name')} placeholder="Enter your name" className={inp(touched.name && !isValidName(form.name))} />
          </TF>
          <TF label="College Name (optional)" error="">
            <input type="text" value={form.college_name} onChange={e => update('college_name', e.target.value)} placeholder="e.g. Nirma University" className={inp(false)} />
          </TF>
          <TF label="Branch / Program" error={touched.branch && !isValidText(form.branch) ? 'Please enter your branch or program' : ''}>
            <input type="text" value={form.branch} onChange={e => update('branch', e.target.value)} onBlur={() => touch('branch')} placeholder="e.g. B.Tech Computer Science" className={inp(touched.branch && !isValidText(form.branch))} />
          </TF>
          <TF label="Current Year" error={touched.current_year && !form.current_year ? 'Please select your current year' : ''}>
            <select value={form.current_year} onChange={e => update('current_year', e.target.value)} onBlur={() => touch('current_year')} className={inp(touched.current_year && !form.current_year)}>
              <option value="">Select Year</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </TF>
        </FlowStep>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your interests & career goal</h2>
          <InterestPicker form={form} toggleMulti={toggleMulti} />
          {form.interests.length === 0 && <p className="text-red-500 text-xs mt-1">⚠️ Please select at least one interest</p>}
          <div className="mt-4">
            <TF label="Career Goal (optional)" error="">
              <input type="text" value={form.career_goal} onChange={e => update('career_goal', e.target.value)} placeholder="e.g. Software Engineer, Data Scientist..." className={inp(false)} />
            </TF>
          </div>
          <SkillPicker form={form} toggleMulti={toggleMulti} />

          {/* Primary CTA — College Assistant */}
          <div className="mt-6 p-5 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-700 font-semibold mb-1">🎓 You're in college!</p>
            <p className="text-sm text-gray-600 mb-4">Your Personal Assistant will guide you through your entire college journey — checklist, resources, internships, placements and more.</p>
            <button
              onClick={() => { localStorage.setItem('pathaiProfile', JSON.stringify(form)); navigate('/assistant') }}
              className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-purple-700"
            >
              Open My College Assistant →
            </button>
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">← Back</button>
            <button onClick={onSubmit} disabled={loading || form.interests.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {loading ? 'Analyzing...' : 'Get Career Paths too →'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Graduate Flow ────────────────────────────────────────────────
function GraduateFlow({ step, setStep, form, update, touch, touched, toggleMulti, loading, onSubmit }) {
  return (
    <>
      {step === 1 && (
        <FlowStep title="Tell us about yourself"
          onNext={() => setStep(2)}
          nextDisabled={!isValidName(form.name) || !isValidText(form.branch)}>
          <TF label="Your Name" error={touched.name && !isValidName(form.name) ? "Enter a valid name (min 2 characters)" : ''}>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} onBlur={() => touch('name')} placeholder="Enter your name" className={inp(touched.name && !isValidName(form.name))} />
          </TF>
          <TF label="Graduated Branch / Degree" error={touched.branch && !isValidText(form.branch) ? 'Please enter your degree' : ''}>
            <input type="text" value={form.branch} onChange={e => update('branch', e.target.value)} onBlur={() => touch('branch')} placeholder="e.g. B.Tech Computer Science" className={inp(touched.branch && !isValidText(form.branch))} />
          </TF>
          <TF label="College Name (optional)" error="">
            <input type="text" value={form.college_name} onChange={e => update('college_name', e.target.value)} placeholder="e.g. Nirma University" className={inp(false)} />
          </TF>
        </FlowStep>
      )}
      {step === 2 && (
        <FlowStep title="What are you looking for?" onBack={() => setStep(1)} nextLabel={loading ? 'Analyzing...' : 'Get Guidance →'} onNext={onSubmit} nextDisabled={loading || form.interests.length === 0}>
          <TF label="Career Goal (optional)" error="">
            <input type="text" value={form.career_goal} onChange={e => update('career_goal', e.target.value)} placeholder="e.g. Software Engineer, MBA, Startup..." className={inp(false)} />
          </TF>
          <InterestPicker form={form} toggleMulti={toggleMulti} />
          {form.interests.length === 0 && <p className="text-red-500 text-xs mt-2">⚠️ Please select at least one interest</p>}
          <SkillPicker form={form} toggleMulti={toggleMulti} />
        </FlowStep>
      )}
    </>
  )
}

// ─── Reusable UI ──────────────────────────────────────────────────
const inp = (hasError) =>
  `w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${hasError ? 'border-red-400 focus:ring-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-400'}`

function TF({ label, error, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
    </div>
  )
}

function PctField({ label, value, onChange, touched, onBlur, required = true }) {
  const val = parseFloat(value)
  const hasError = touched && value !== '' && (isNaN(val) || val < 0 || val > 100)
  const isEmpty = touched && required && value === ''
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
      <input
        type="number" value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="e.g. 85" min="0" max="100"
        className={inp(hasError || isEmpty)}
      />
      {hasError && <p className="text-red-500 text-xs mt-1">⚠️ Percentage must be between 0 and 100</p>}
      {isEmpty && <p className="text-red-500 text-xs mt-1">⚠️ This field is required</p>}
    </div>
  )
}

function FlowStep({ title, children, onNext, onBack, nextLabel = 'Next →', nextDisabled = false }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
      {children}
      <div className="flex justify-between pt-2">
        {onBack ? (
          <button onClick={onBack} className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">← Back</button>
        ) : <div />}
        {onNext && (
          <button onClick={onNext} disabled={nextDisabled} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  )
}

function InterestPicker({ form, toggleMulti }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Select your Interests <span className="text-red-500">*</span></label>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map(i => (
          <button key={i} onClick={() => toggleMulti('interests', i)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${form.interests.includes(i) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
            {i}
          </button>
        ))}
      </div>
    </div>
  )
}

function SkillPicker({ form, toggleMulti }) {
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Your Strengths (optional)</label>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map(s => (
          <button key={s} onClick={() => toggleMulti('skills', s)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${form.skills.includes(s) ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-400'}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
