import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ExplainabilityPage from './pages/ExplainabilityPage/ExplainabilityPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { SettingsProvider } from './context/SettingsContext';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/explainability" element={<ExplainabilityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
};

export default App;
