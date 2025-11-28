// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Za chwilę stworzymy ten plik CSS

const Sidebar = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h2>Investment Tracker</h2>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/portfolio">Portfolio</Link>
                </li>
                <li>
                    <Link to="/others">Charts</Link>
                </li>
                <li>
                    <Link to="/history">Transaction History</Link>
                </li>
                <li>
                    <Link to="/news">News</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;