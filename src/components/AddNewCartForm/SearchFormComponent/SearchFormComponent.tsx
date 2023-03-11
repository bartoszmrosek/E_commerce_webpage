import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useDebounce } from "../../../hooks/useDebounce";
import { useFetch } from "../../../hooks/useFetch";
import { CartProduct } from "../../../types/CartProduct";
import { SingleFormProduct } from "../../../types/SingleProduct";
import { isValidError } from "../../../utils/isValidError";
import styles from "./SearchFormComponent.module.css";

interface SearchFormComponentProps {
    handleNewProduct: (product: SingleFormProduct) => void;
}

// Due to memoization and eslint rules I need extra react subcomponent to use useCallback inside array.map function in main component
const TableRowSubcomponent: React.FC<{
    product: CartProduct;
    handleNewProduct: (product: SingleFormProduct) => void;
}> = ({ product, handleNewProduct }) => {
    const memoizedHandler = useCallback(() => {
        handleNewProduct({ id: product.id, quantity: "1", title: product.title });
    }, [handleNewProduct, product.id, product.title]);
    return (
        <tr key={product.id} className={styles.searchTableRow}>
            <td>{product.title}</td>
            <td><button onClick={memoizedHandler} type="button" className={styles.addBtn}>Add product</button></td>
        </tr>
    );
};

export const SearchFormComponent: React.FC<SearchFormComponentProps> = ({ handleNewProduct }) => {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce<string>(searchValue, 500);
    const [searchResponse, isSearching, makeSearchRequest] = useFetch<{
        products: CartProduct[];
    }>(`https://dummyjson.com/products/search?q=${debouncedSearchValue}`);

    const handleSearchUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (debouncedSearchValue.trim().length > 1) {
            void makeSearchRequest({ signal: controller.signal });
        }
        return () => controller.abort();
    }, [debouncedSearchValue, makeSearchRequest]);

    // Just to make sure any accidential enter wouldn`t trigger whole form submit.
    const preventFormSubmit = useCallback((e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && e.preventDefault(), []);

    return (
        <div className={styles.searchWrapper}>
            <input
                type="search"
                value={searchValue}
                onChange={handleSearchUpdate}
                className={styles.searchInput}
                placeholder="Start searching for products..."
                onKeyDown={preventFormSubmit}
            />
            <div className={styles.searchTableWrapper}>
                <table className={styles.searchTable}>
                    <tbody>
                        {!isSearching ? (
                            <>
                                {!isValidError(searchResponse) && (searchResponse && searchResponse.products.length > 0) ? (
                                    <>
                                        {searchResponse.products.map((product) => (
                                            <TableRowSubcomponent key={product.id} product={product} handleNewProduct={handleNewProduct} />
                                        ))}
                                    </>
                                ) : (
                                    <tr><td colSpan={100}>{searchResponse === null ? "Start searching" : "Couldn`t find any data"}</td></tr>
                                )}
                            </>
                        ) : (
                            <tr>
                                <td className={styles.loaderWrapper}>
                                    <BeatLoader
                                        loading={true}
                                        color="var(--mainBlue)"
                                        role="progressbar"
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
