import React, { ChangeEvent, useCallback } from "react";
import { SingleFormProduct } from "../../../types/SingleProduct";
import { preventFormSubmit } from "../../../utils/preventSubmit";
import styles from "./ProductsFormComponent.module.css";

interface ProductsFormComponentProps {
    products: SingleFormProduct[];
    updateQuantity: (id: number, newQuantity: string) => void;
    removeProductFromForm: (id: number) => void;
}

const ProductRowSubcomponent: React.FC<{
    product: SingleFormProduct;
    updateQuanity: ProductsFormComponentProps["updateQuantity"];
    removeProductFromForm: ProductsFormComponentProps["removeProductFromForm"];
}> = ({ product, updateQuanity, removeProductFromForm }) => {
    const inputHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateQuanity(product.id, e.currentTarget.value);
    }, [product.id, updateQuanity]);

    const btnHandler = useCallback(() => {
        removeProductFromForm(product.id);
    }, [product.id, removeProductFromForm]);

    return (
        <tr key={product.id} className={styles.productRow}>
            <td>{product.title}</td>
            <td><input
                value={product.quantity}
                onChange={inputHandler}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={styles.quantityInput}
                onKeyDown={preventFormSubmit}
            />
            </td>
            <td><button type="button" onClick={btnHandler} className={styles.removeBtn}>Remove</button></td>
        </tr>
    );
};

export const ProductsFormComponent: React.FC<ProductsFormComponentProps> = ({ products, updateQuantity, removeProductFromForm }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.productsTable}>
                <thead className={styles.productsHeader}>
                    <tr><th colSpan={100}><h2>Current cart products</h2></th></tr>
                    <tr><th>Product</th><th>Quantity</th><th>Action</th></tr>
                </thead>
                <tbody>
                    {products.length > 0 ? products.map((product) => (
                        <ProductRowSubcomponent
                            key={product.id}
                            product={product}
                            updateQuanity={updateQuantity}
                            removeProductFromForm={removeProductFromForm}
                        />
                    )) : <tr><td colSpan={100}>No products added yet</td></tr>}
                </tbody>
            </table>
        </div>
    );
};
