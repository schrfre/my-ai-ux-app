import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ExplainabilityPage from './pages/ExplainabilityPage/ExplainabilityPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { SettingsProvider } from './context/SettingsContext';
import styles from './App.module.css';
import LearningPlansPage from './pages/LearningPlansPage/LearningPlansPage';
import ProgressPage from './pages/ProgressPage/ProgressPage';
import { LearningProvider } from './context/LearningContext';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <LearningProvider>
        <BrowserRouter>
          <div className={styles.layout}>
            <Navbar />
            <main className={styles.mainContent}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/learning-plans" element={<LearningPlansPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/explainability" element={<ExplainabilityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/progress" element={<ProgressPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </LearningProvider>
    </SettingsProvider>
  );
};

export default App;
