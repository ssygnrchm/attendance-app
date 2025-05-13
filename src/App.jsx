import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ClassList from './components/ClassList'

function App() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Hello, Student Attendance App 👋</h1>
      <ClassList />
    </div>
  );
}

export default App
