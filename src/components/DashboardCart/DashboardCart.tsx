import React, { memo, useCallback, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import styles from "./DasboardCart.module.css";
import { Cart } from "../../types/Cart";
import { useMobileMedia } from "../../hooks/useMobileMedia";
import { useFetch } from "../../hooks/useFetch";
import { isValidError } from "../../utils/isValidError";

interface DasboardCartProps {
    cart: Cart;
    handleCartRemove: (id: number) => void;
}

export const DasboardCart: React.FC<DasboardCartProps> = memo(function DasboardCart({ cart, handleCartRemove }) {
    const { id, total, totalProducts, totalQuantity, discountedTotal } = cart;
    const { isMobile } = useMobileMedia();
    const [deleteStatus, isLoading, makeDeleteRequest] = useFetch<{ id: number; isDeleted: boolean; }>(`https://dummyjson.com/carts/${cart.id}`);
    const navigate = useNavigate();

    const handleDeleteBtn = useCallback(() => {
        void makeDeleteRequest({
            method: "DELETE",
        });
    }, [makeDeleteRequest]);

    const handleViewBtn = useCallback(() => {
        navigate(`/dashboard/cart/${cart.id}`);
    }, [cart.id, navigate]);

    useEffect(() => {
        if (deleteStatus !== null && !isValidError(deleteStatus) && deleteStatus.isDeleted) {
            handleCartRemove(deleteStatus.id);
        }
    }, [deleteStatus, handleCartRemove]);
    return (
        <>
            <tr className={styles.dashboardCartRow}>
                <td rowSpan={2}>{id}</td>
                {!isMobile && (
                    <>
                        <td>{totalProducts} pieces</td>
                        <td>{totalQuantity} pieces</td>
                    </>
                )}
                <td>{total} €</td>
                <td>{discountedTotal} €</td>
            </tr>
            <tr className={styles.dashboardCartActions}>
                <td colSpan={100} className={styles.dashboardCartActions}>
                    <button className={styles.viewBtn} onClick={handleViewBtn}>View</button>
                    <button className={styles.deleteBtn} onClick={handleDeleteBtn} disabled={isLoading}>
                        {!isLoading ? (
                            <>
                                {!isValidError(deleteStatus) ? "Delete" : "Couldn`t delete"}
                            </>
                        ) : <BeatLoader loading={true} color="var(--milky)" size={10} role="progressbar" />}
                    </button>
                </td>
            </tr>
        </>
    );
});
