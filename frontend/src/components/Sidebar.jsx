// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Za chwilę stworzymy ten plik CSS

const Sidebar = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h2>InvestmentApp</h2>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/portfolio">Portfolio</Link>
                </li>
                <li>
                    <Link to="/ustawienia">Others</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;