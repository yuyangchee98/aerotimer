import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          🛫 AeroTimer
        </h1>
        <p className="text-blue-200 mb-6">
          Tailwind CSS v4 is working! Ready to start development.
        </p>
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Test Counter: {count}
        </button>
      </div>
    </div>
  )
}

export default App
