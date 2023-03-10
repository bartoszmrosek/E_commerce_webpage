import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useDebounce } from "../../../hooks/useDebounce";
import { useFetch } from "../../../hooks/useFetch";
import { CartProduct } from "../../../types/CartProduct";
import { SingleFormProduct } from "../../../types/SingleProduct";
import { isValidError } from "../../../utils/isValidError";

interface SearchFormComponentProps {
    handleNewProduct: (product: SingleFormProduct) => void;
}

// Due to memoization and eslint rules I need extra react subcomponent to use useCallback inside array.map function in main component
const TableRowSubcomponent: React.FC<{
    product: CartProduct;
    handleNewProduct: (product: SingleFormProduct) => void;
}> = ({ product, handleNewProduct }) => {
    const memoizedHandler = useCallback(() => {
        handleNewProduct({ id: product.id, quantity: 1 });
    }, [handleNewProduct, product.id]);
    return (
        <tr key={product.id}>
            <td>{product.title}</td>
            <td><button onClick={memoizedHandler} type="button">Add product</button></td>
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
        if (debouncedSearchValue.trim().length > 1) {
            void makeSearchRequest();
        }
    }, [debouncedSearchValue, makeSearchRequest]);

    return (
        <>
            <input type="search" value={searchValue} onChange={handleSearchUpdate} />
            <table>
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
                    ) : <tr><td><BeatLoader loading={true} /></td></tr>}
                </tbody>
            </table>
        </>
    );
};
