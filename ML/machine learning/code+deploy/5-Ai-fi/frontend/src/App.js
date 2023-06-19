import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Navbar from './components/Navbar'
import Yoga from './pages/Yoga/Yoga'
import Homer  from './pages/Home'
import ExerciseDetail from './pages/ExerciseDetail'
import './App.css'

export default function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/start" element={<Yoga />} />
        <Route path="/" element={<Homer />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
      </Routes>
    </Router>
  );
}


