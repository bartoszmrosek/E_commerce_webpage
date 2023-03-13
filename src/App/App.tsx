import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { NotFound } from "../pages/NotFound/NotFound";
import { SingleCartViewer } from "../pages/SingleCartViewer/SingleCartViewer";
import { Store } from "../pages/Store/Store";
import styles from "./App.module.css";

export const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className={styles.appContainer}>
                <Routes>
                    <Route path="/*">
                        <Route path="store" element={<Store />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="dashboard/cart/:cartid" element={<SingleCartViewer />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
};
