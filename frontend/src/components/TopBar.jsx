// src/components/TopBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TopBar.css'; // Za chwilę stworzymy ten plik CSS

const TopBar = () => {
    // Tutaj w przyszłości możesz dodać logikę pokazującą nazwę aktualnej strony
    return (
        <header className="topbar">
            <div className="topbar-title">
                <h1>Dashboard</h1>
            </div>
            <div className="topbar-actions">
                <Link to="/logout" className="logout-button">Wyloguj</Link>
            </div>
        </header>
    );
};

export default TopBar;