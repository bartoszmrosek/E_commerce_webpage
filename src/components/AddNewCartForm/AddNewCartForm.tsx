import React, { useCallback, useState } from "react";
import { SingleFormProduct } from "../../types/SingleProduct";
import styles from "./AddNewCartForm.module.css";
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
            return [
                ...currProducts.slice(0, existingProductIndex),
                { ...product, quantity: currProducts[existingProductIndex].quantity + product.quantity },
                ...currProducts.slice(existingProductIndex + 1),
            ];
        });
    }, []);

    console.log(currentFormProducts);
    return (
        <div className={`${styles.wrapper} ${shouldAppear ? styles.wrapperIsVisible : null}`}>
            <form className={styles.addNewCartForm}>
                <h1>New cart form</h1>
                <SearchFormComponent handleNewProduct={handleNewFormProduct} />
                <div>Products placholder</div>
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
