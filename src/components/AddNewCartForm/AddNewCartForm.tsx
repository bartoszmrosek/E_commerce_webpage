import React, { useCallback, useState } from "react";
import { SingleFormProduct } from "../../types/SingleProduct";
import styles from "./AddNewCartForm.module.css";
import { ProductsFormComponent } from "./ProductsFormComponent/ProductsFormComponent";
import { SearchFormComponent } from "./SearchFormComponent/SearchFormComponent";

interface AddNewCartProps {
    shouldAppear: boolean;
    switchIsFormDisplayed: () => void;
}

export const AddNewCartForm: React.FC<AddNewCartProps> = ({ shouldAppear, switchIsFormDisplayed }) => {
    const [currentFormProducts, setCurrentFormProducts] = useState<SingleFormProduct[]>([]);

    const handleNewFormProduct = useCallback((product: SingleFormProduct) => {
        setCurrentFormProducts((currProducts) => {
            const existingProductIndex = currProducts.findIndex((currProduct) => currProduct.id === product.id);
            if (existingProductIndex === -1) {
                return [...currProducts, product];
            }
            const formatedCurrQuantity = parseInt(currProducts[existingProductIndex].quantity, 10);
            return [
                ...currProducts.slice(0, existingProductIndex),
                {
                    ...product,
                    // This is to make sure that input values doesn`t make any weird side-effects since they use strings rather than numbers
                    quantity: Number.isNaN(formatedCurrQuantity) ?
                        "1" : (formatedCurrQuantity + parseInt(product.quantity, 10)).toString(),
                },
                ...currProducts.slice(existingProductIndex + 1),
            ];
        });
    }, []);

    const updateQuantity = useCallback((id: number, newQuantity: string) => {
        setCurrentFormProducts(products => {
            const productIndex = products.findIndex((prod) => prod.id === id);
            return [
                ...products.slice(0, productIndex),
                { ...products[productIndex], quantity: newQuantity },
                ...products.slice(productIndex + 1),
            ];
        });
    }, []);

    const removeProductFromForm = useCallback((id: number) => {
        setCurrentFormProducts(currProducts => currProducts.filter((product) => product.id !== id));
    }, []);

    return (
        <div className={`${styles.wrapper} ${shouldAppear ? styles.wrapperIsVisible : null}`}>
            <form className={styles.addNewCartForm}>
                <h1>New cart form</h1>
                <SearchFormComponent handleNewProduct={handleNewFormProduct} />
                <ProductsFormComponent
                    products={currentFormProducts}
                    updateQuantity={updateQuantity}
                    removeProductFromForm={removeProductFromForm}
                />
                <button type="submit">Add</button>
                {/* Hacky way but makes the button sticky to form with relative and absolute positioning (responsivity included) */}
                <button className={styles.hideFormBtn} type="button" onClick={switchIsFormDisplayed}>
                    <svg
                        height="512px"
                        version="1.1"
                        viewBox="0 0 512 512"
                        width="512px"
                        xmlSpace="preserve"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
