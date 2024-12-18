import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
        <li><Link to="/explainability">Erklärungen</Link></li>
        <li><Link to="/settings">Einstellungen</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; 