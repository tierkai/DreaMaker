import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/Layout/MainLayout'
import { AuthProvider } from './contexts/AuthContext'

import Dashboard from './pages/Dashboard'
import DreamGenerator from './pages/DreamLab/DreamGenerator'
import NeuralMapping from './pages/DreamLab/NeuralMapping'
import DigitalTwin from './pages/DigitalTwin'
import Experiments from './pages/Experiments'
import AISalon from './pages/AISalon'
import Integration from './pages/Integration'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/dreamlab/generator" element={<DreamGenerator />} />
            <Route path="/dreamlab/mapping" element={<NeuralMapping />} />
            <Route path="/dreamlab/analysis" element={<DreamGenerator />} />
            <Route path="/dreamlab/visualization" element={<NeuralMapping />} />
            
            <Route path="/digital-twin/simulation" element={<DigitalTwin />} />
            <Route path="/digital-twin/neural" element={<DigitalTwin />} />
            <Route path="/digital-twin/behavior" element={<DigitalTwin />} />
            <Route path="/digital-twin/training" element={<DigitalTwin />} />
            
            <Route path="/experiments/automated" element={<Experiments />} />
            <Route path="/experiments/hypothesis" element={<Experiments />} />
            <Route path="/experiments/results" element={<Experiments />} />
            <Route path="/experiments/design" element={<Experiments />} />
            
            <Route path="/ai-salon/chat" element={<AISalon />} />
            <Route path="/ai-salon/extraction" element={<AISalon />} />
            <Route path="/ai-salon/quality" element={<AISalon />} />
            <Route path="/ai-salon/reports" element={<AISalon />} />
            
            <Route path="/integration/pipeline" element={<Integration />} />
            <Route path="/integration/neuro-data" element={<Integration />} />
            <Route path="/integration/api" element={<Integration />} />
            <Route path="/integration/health" element={<Integration />} />
            
            <Route path="/admin/users" element={<Admin />} />
            <Route path="/admin/config" element={<Admin />} />
            <Route path="/admin/logs" element={<Admin />} />
            <Route path="/admin/performance" element={<Admin />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  )
}

export default App
