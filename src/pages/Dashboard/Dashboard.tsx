import React from "react";
import styles from "./Dashboard.module.css";

export const Dashboard: React.FC = () => {
    return (
        <main className={styles.dashboardContainer}>
            <h1 className={styles.cartsHeader}>All carts</h1>
            <table className={styles.cartsTable}>
                <thead>
                    <tr className={styles.cartsTableHeaders}>
                        <th>Cart number</th>
                        <th>Total products</th>
                        <th>Total quantity</th>
                        <th>Total</th>
                        <th>Discounted total</th>
                    </tr>
                </thead>
            </table>
            <button className={styles.newCartBtn}>Add new cart</button>
        </main>
    );
};
