// App.js - ZAKTUALIZOWANA WERSJA
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PortfolioPage from "./pages/PortfolioPage"
import Charts from "./pages/Charts";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout"; // <-- IMPORTUJEMY LAYOUT
import TransactionHistory from "./pages/TransactionHistory";

import "../src/styles/Form.css";
// Zaimportuj też nowe pliki CSS
import "../src/styles/Layout.css";
import "../src/styles/Sidebar.css";
import "../src/styles/TopBar.css";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Trasy publiczne, które NIE MAJĄ mieć sidebara i topbara */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/logout" element={<Logout />} />

                {/* Trasa-rodzic dla wszystkich chronionych podstron */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    {/* Trasy zagnieżdżone - będą renderowane w <Outlet /> w Layout.js */}
                    <Route index element={<Home />} />
                    {/* Poniżej możesz dodać kolejne podstrony, które będą miały nawigację */}
                    <Route path="portfolio" element={<PortfolioPage />} />
                    <Route path="charts" element={<Charts />} />
                    <Route path="history" element={<TransactionHistory />} />
                    {/* np. <Route path="ustawienia" element={<SettingsPage />} /> */}
                </Route>

                {/* Trasa "łapiąca" wszystkie inne, niepasujące adresy */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;