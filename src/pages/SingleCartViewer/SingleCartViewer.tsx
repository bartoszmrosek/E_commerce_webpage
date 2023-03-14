import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFetch } from "../../hooks/useFetch";
import { Cart } from "../../types/Cart";
import { isValidError } from "../../utils/isValidError";
import styles from "./SingleCartViewer.module.css";

const SingleCartViewer: React.FC = () => {
    const { cartId } = useParams();
    const [response, isLoading, makeRequest] = useFetch<Cart>(`https://dummyjson.com/carts/${cartId}`);
    const chartSpecifiedProduct = response !== null && !isValidError(response) && response.products.length > 0 ?
        response.products.map((product) => ({ ...product, discountedPrice: (product.price / product.quantity).toFixed(2) }))
        : undefined;

    useEffect(() => {
        const controller = new AbortController();
        void makeRequest({ signal: controller.signal });
        return () => controller.abort();
    }, [makeRequest]);

    const retryFetching = useCallback(() => {
        void makeRequest();
    }, [makeRequest]);

    return (
        <main className={styles.singleCartMain}>
            {cartId && parseInt(cartId, 10) > 0 ? (
                <>
                    <h1 className={styles.singleCartHeader}>Cart {cartId}</h1>
                    {!isLoading ? (
                        <>
                            {response !== null && !isValidError(response) ? (
                                <>
                                    <h1 className={styles.cartHeader}>Products:</h1>
                                    {response.products.length > 0 ? (
                                        <>
                                            <div className={styles.cartTableWrapper}>
                                                <table className={styles.cartTable}>
                                                    <tbody>
                                                        {response.products.map((product) => (
                                                            <tr key={product.id} className={styles.cartTableRow}>
                                                                <td>{product.title}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ResponsiveContainer width="100%" height="90%">
                                                <LineChart
                                                    width={500}
                                                    height={300}
                                                    data={chartSpecifiedProduct}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="title" padding={{ left: 50, right: 50 }} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                                                    <Line type="monotone" dataKey="discountedPrice" stroke="#82ca9d" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </>
                                    ) : <p>Cart is empty</p>}
                                </>
                            ) : (
                                <div className={styles.errorWrapper}>
                                    <p>Couldn`t load data. Please retry</p>
                                    <button onClick={retryFetching} className={styles.errorBtn}>Try again</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.cartLoader}>
                            <FadeLoader loading={true} color="var(--mainBlue)" />
                        </div>
                    )}
                </>
            ) : <div>Cart not found</div>}
        </main>
    );
};

// Due to beeing lazy loaded
// eslint-disable-next-line import/no-default-export
export default SingleCartViewer;
