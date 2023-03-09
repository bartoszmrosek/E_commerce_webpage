import React, { useCallback, useEffect } from "react";
import { GridLoader } from "react-spinners";
import { useFetch } from "../../hooks/useFetch";
import { Cart } from "../../types/Cart";
import { isValidError } from "../../utils/isValidError";
import styles from "./Dashboard.module.css";

interface CartsType {
    carts: Cart[];
    total: number;
    skip: number;
    limit: number;
}

export const Dashboard: React.FC = () => {
    const { response, isLoading, makeRequest } = useFetch<CartsType>("https://dummyjson.com/carts");
    useEffect(() => {
        const controller = new AbortController();
        void makeRequest({ signal: controller.signal });
        return () => controller.abort();
    }, [makeRequest]);
    const retryFetch = useCallback(() => {
        void makeRequest();
    }, [makeRequest]);
    return (
        <main className={styles.dashboardContainer}>
            <h1 className={styles.cartsHeader}>All carts</h1>
            <table className={styles.cartsTable}>
                <thead>
                    <tr className={styles.cartsTableHeaders}>
                        <th>Cart id</th>
                        <th>Total products</th>
                        <th>Total quantity</th>
                        <th>Total</th>
                        <th>Discounted total</th>
                    </tr>
                </thead>
                <tbody className={styles.cartsTableBody}>
                    {!isLoading && !isValidError(response)
                        ? <tr>ok</tr> :
                        (
                            <tr>
                                <td colSpan={100} className={styles.cartsTableAdditional}>
                                    {isLoading ? (
                                        <>
                                            <GridLoader loading={true} color="var(--mainBlue)" />
                                            <p>Loading data...</p>
                                        </>
                                    )
                                        : (
                                            <>
                                                <p>Loading data failed</p>
                                                <button onClick={retryFetch} className={styles.retryBtn}>Retry</button>
                                            </>
                                        )}
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
            <button className={styles.newCartBtn}>Add new cart</button>
        </main>
    );
};
