import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { Navbar } from "../components/Navbar/Navbar";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { NotFound } from "../pages/NotFound/NotFound";
import { Store } from "../pages/Store/Store";
import styles from "./App.module.css";

const SingleCartViewer = lazy(() => import("../pages/SingleCartViewer/SingleCartViewer"));

export const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className={styles.appContainer}>
                <Suspense fallback={<div className={styles.mainLoader}><FadeLoader loading={true} color="var(--mainBlue)" /></div>}>
                    <Routes>
                        <Route path="/*">
                            <Route path="store" element={<Store />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="dashboard/cart/:cartId" element={<SingleCartViewer />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Suspense>
            </div>
        </>
    );
};
