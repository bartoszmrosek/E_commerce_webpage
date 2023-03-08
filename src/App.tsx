import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { NotFound } from "./pages/NotFound/NotFound";
import { Store } from "./pages/Store/Store";

export const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/*">
                    <Route path="store" element={<Store />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
};
