import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
    const isActiveLink = useCallback(({ isActive }: { isActive: boolean; }) => {
        return isActive ? `${styles.selected} ${styles.navigationLink}` : `${styles.navigationLink}`;
    }, []);

    return (
        <nav className={styles.navigation}>
            <NavLink to="/store" className={isActiveLink}>Store</NavLink>
            <NavLink to="/dashboard" className={isActiveLink}>Dashboard</NavLink>
        </nav>
    );
};
