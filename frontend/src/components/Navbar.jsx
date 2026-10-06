import { Link, useLocation } from 'react-router-dom'
import { Compass, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { dark, setDark } = useTheme()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/onboarding', label: 'Get Started' },
    { to: '/aptitude-test', label: 'Aptitude Test' },
    { to: '/assistant', label: '🎓 My Assistant' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
          <Compass className="w-6 h-6" />
          PathAI
        </Link>

        <div className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${
                pathname === to
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(d => !d)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark
              ? <Sun className="w-4 h-4 text-yellow-400" />
              : <Moon className="w-4 h-4 text-gray-600" />
            }
          </button>
        </div>
      </div>
    </nav>
  )
}
