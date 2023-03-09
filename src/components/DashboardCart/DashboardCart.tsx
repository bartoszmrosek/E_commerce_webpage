import React, { memo } from "react";
import styles from "./DasboardCart.module.css";
import { Cart } from "../../types/Cart";
import { useMobileMedia } from "../../hooks/useMobileMedia";

interface DasboardCartProps {
    cart: Cart;
}

export const DasboardCart: React.FC<DasboardCartProps> = memo(function DasboardCart({ cart }) {
    const { id, total, totalProducts, totalQuantity, discountedTotal } = cart;
    const { isMobile } = useMobileMedia();
    return (
        <>
            <tr className={styles.dashboardCartRow}>
                <td rowSpan={2}>{id}</td>
                {!isMobile && (
                    <>
                        <td>{totalProducts} sztuk</td>
                        <td>{totalQuantity} sztuk</td>
                    </>
                )}
                <td>{total} zł</td>
                <td>{discountedTotal} zł</td>
            </tr>
            <tr className={styles.dashboardCartActions}>
                <td colSpan={100} className={styles.dashboardCartActions}>
                    <button className={styles.viewBtn}>View</button>
                    <button className={styles.deleteBtn}>Delete</button>
                </td>
            </tr>
        </>
    );
});
