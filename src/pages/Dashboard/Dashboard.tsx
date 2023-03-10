import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { GridLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import { useFetch } from "../../hooks/useFetch";
import { Cart } from "../../types/Cart";
import { isValidError } from "../../utils/isValidError";
import { DashboardTableExtraInfo } from "./DasboardTableExtraInfo/DasboardTableExtraInfo";
import styles from "./Dashboard.module.css";
import { DasboardCart } from "../../components/DashboardCart/DashboardCart";
import { useMobileMedia } from "../../hooks/useMobileMedia";
import { AddNewCartForm } from "../../components/AddNewCartForm/AddNewCartForm";

interface CartsType {
    carts: Cart[];
    total: number;
    skip: number;
    limit: number;
}

export const Dashboard: React.FC = () => {
    const [response, isLoading, makeRequest] = useFetch<CartsType>("https://dummyjson.com/carts/");
    const { isMobile } = useMobileMedia();
    const [shouldDisplayForm, setShoudDisplayForm] = useState(false);
    const [displayedData, setDisplayedData] = useState<CartsType | Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        void makeRequest({ signal: controller.signal });
        return () => controller.abort();
    }, [makeRequest]);
    const retryFetch = useCallback(() => {
        void makeRequest();
    }, [makeRequest]);

    const whichDisplayMode: CSSProperties = {
        display: isValidError(displayedData) || isLoading || (displayedData === null || displayedData.carts.length < 1) ? "table" : "block",
    };

    const switchIsFormDisplayed = useCallback(() => {
        setShoudDisplayForm(prev => !prev);
    }, []);

    const addNewDataToTable = useCallback((cart: Cart) => {
        setDisplayedData(currData => {
            if (currData !== null && !isValidError(currData)) {
                return { ...currData, carts: [cart, ...currData.carts] };
            }
            return currData;
        });
    }, []);

    useEffect(() => {
        setDisplayedData(response);
    }, [response]);

    return (
        <main className={styles.dashboardContainer}>
            <h1 className={styles.cartsHeader}>All carts</h1>
            <table className={styles.cartsTable} style={whichDisplayMode}>
                <thead>
                    <tr className={styles.cartsTableHeaders}>
                        <th>Cart id</th>
                        {!isMobile && (
                            <>
                                <th>Total products</th>
                                <th>Total quantity</th>
                            </>
                        )}
                        <th>Total</th>
                        <th>After discount</th>
                    </tr>
                </thead>
                <tbody className={styles.cartsTableBody}>
                    {!isLoading && !isValidError(displayedData)
                        ? (
                            <>
                                {displayedData !== null && displayedData.carts.length > 0 ?
                                    displayedData.carts.map((cart) => <DasboardCart cart={cart} key={`${uuidv4()}`} />)
                                    : (
                                        <DashboardTableExtraInfo>
                                            No carts can be found! Add some!
                                        </DashboardTableExtraInfo>
                                    )}
                            </>
                        ) :
                        // loading and error displayers
                        (
                            <DashboardTableExtraInfo>
                                {isLoading ? (
                                    <>
                                        <GridLoader loading={true} color="var(--mainBlue)" role="progressbar" />
                                        <p>Loading data...</p>
                                    </>
                                )
                                    : (
                                        <>
                                            <p>Loading data failed</p>
                                            <button onClick={retryFetch} className={styles.retryBtn}>Retry</button>
                                        </>
                                    )}
                            </DashboardTableExtraInfo>
                        )}
                </tbody>
            </table>
            <button className={styles.newCartBtn} onClick={switchIsFormDisplayed}>Add new cart</button>
            <AddNewCartForm
                shouldAppear={shouldDisplayForm}
                switchIsFormDisplayed={switchIsFormDisplayed}
                addNewDataToTable={addNewDataToTable}
            />
        </main>
    );
};
