import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

export const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => {
        navigate("/dashboard");
    }, [navigate]);

    return (
        <main className={styles.notFound}>
            <p>
                Site not found. Maybe address is wrong?
            </p>
            <button onClick={handleClick} className={styles.returnBtn}>Return to dashboard</button>
        </main>
    );
};
