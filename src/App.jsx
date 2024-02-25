import React from 'react'
import Demo from './components/demo'
import Hero from './components/hero'
import './App.css'

function App() {
  return (
    <main>
      <div className='main'>
        <div className='gradient' />
      </div>

      <div className='app'>
        <Hero />
        <Demo />
      </div>
    </main>
  )
}

export default App