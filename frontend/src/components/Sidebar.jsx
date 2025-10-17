// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Za chwilę stworzymy ten plik CSS

const Sidebar = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h2>Twoja Aplikacja</h2>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/portfolio">Moje Portfele</Link> {/* Przykład nowej podstrony */}
                </li>
                <li>
                    <Link to="/ustawienia">Ustawienia</Link> {/* Przykład nowej podstrony */}
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;