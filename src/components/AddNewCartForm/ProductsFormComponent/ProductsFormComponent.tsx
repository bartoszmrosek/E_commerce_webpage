import React, { ChangeEvent, useCallback } from "react";
import { SingleFormProduct } from "../../../types/SingleProduct";

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
        <tr key={product.id}>
            <td>{product.title}</td>
            <td><input value={product.quantity} onChange={inputHandler} type="number" /></td>
            <td><button type="button" onClick={btnHandler}>Delete</button></td>
        </tr>
    );
};

export const ProductsFormComponent: React.FC<ProductsFormComponentProps> = ({ products, updateQuantity, removeProductFromForm }) => {
    return (
        <table>
            <thead>
                <tr><th>Product</th><th>Quantity</th></tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map((product) => (
                    <ProductRowSubcomponent
                        key={product.id}
                        product={product}
                        updateQuanity={updateQuantity}
                        removeProductFromForm={removeProductFromForm}
                    />
                )) : <tr><td colSpan={100}>No products found yet</td></tr>}
            </tbody>
        </table>
    );
};
