import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StockPage from './pages/StockPage';
import CorrelationHeatmapPage from './pages/CorrelationHeatmapPage';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StockPage />} />
        <Route path="/correlation" element={<CorrelationHeatmapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
