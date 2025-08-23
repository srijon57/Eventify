import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="flex space-x-6 mb-8">
        <a href="https://vite.dev" target="_blank" className="transform hover:scale-110 transition-transform duration-300">
          <img src={viteLogo} className="w-16 h-16 drop-shadow-lg" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transform hover:scale-110 transition-transform duration-300">
          <img src={reactLogo} className="w-16 h-16 drop-shadow-lg animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
        Vite + React
      </h1>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700/50">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 mb-4"
        >
          Count is {count}
        </button>
        <p className="text-gray-300 text-center">
          Edit <code className="bg-gray-700/50 px-1.5 py-0.5 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-6 text-gray-400 text-sm md:text-base">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App