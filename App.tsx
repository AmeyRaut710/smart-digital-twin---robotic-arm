
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Predictions from './pages/Predictions';
import Maintenance from './pages/Maintenance';
import SystemConfigPage from './pages/SystemConfigPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/config" element={<SystemConfigPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
