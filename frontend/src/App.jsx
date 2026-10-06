import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import CareerResult from './pages/CareerResult'
import AptitudeTest from './pages/AptitudeTest'
import Roadmap from './pages/Roadmap'
import Assistant from './pages/Assistant'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'

// Render the global Chatbot on every page except /assistant (which has its own chat)
function Layout() {
  const location = useLocation()
  const showChatbot = !location.pathname.startsWith('/assistant')
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/career-result" element={<CareerResult />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
      {showChatbot && <Chatbot />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  )
}

export default App
