// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../styles/Layout.css'; // Za chwilę stworzymy ten plik CSS

const Layout = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <main className="page-content">
                    {/* Tutaj będą renderowane Twoje podstrony, np. Home */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;