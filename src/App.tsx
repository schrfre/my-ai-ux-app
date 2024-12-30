import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { HomePage } from './pages/HomePage/HomePage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import ExplainabilityPage from './pages/ExplainabilityPage/ExplainabilityPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ProgressPage from './pages/ProgressPage/ProgressPage';
import LearningPlansPage from './pages/LearningPlansPage/LearningPlansPage';
import { SettingsProvider } from './context/SettingsContext';
import { LearningProvider } from './context/LearningContext';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <LearningProvider>
          <div className={styles.layout}>
            <Navbar />
            <main className={styles.mainContent}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/learning-plans" element={<LearningPlansPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/explainability" element={<ExplainabilityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </LearningProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
};

export default App;
