import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('navbarExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('navbarExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  const toggleNavbar = () => {
    setIsExpanded((prev: boolean) => !prev);
  };

  return (
    <nav className={`${styles.navbar} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.logo}>
        AI
      </div>
      <div className={styles.links}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
          <span>Home</span>
        </NavLink>
        <NavLink to="/learning-plans" className={({ isActive }) => isActive ? styles.active : ''}>
          <span>Lernpläne</span>
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => isActive ? styles.active : ''}>
          <span>Feedback</span>
        </NavLink>
        <NavLink to="/explainability" className={({ isActive }) => isActive ? styles.active : ''}>
          <span>Erklärungen</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : ''}>
          <span>Einstellungen</span>
        </NavLink>
      </div>
      <button 
        className={styles.toggleButton}
        onClick={toggleNavbar}
        title={isExpanded ? "Navbar einklappen" : "Navbar ausklappen"}
      >
        <span className={styles.toggleIcon}>
          {isExpanded ? '◀' : '▶'}
        </span>
      </button>
    </nav>
  );
};

export default Navbar; 