import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { SingleFormProduct } from "../../../types/SingleProduct";
import { ProductsFormComponent } from "./ProductsFormComponent";

const productsMock: SingleFormProduct[] = [
    {
        id: 1,
        title: "mock",
        quantity: "10",
    },
];
const defaultMock = vi.fn();

describe("ProductsFormComponent", () => {
    it("renders product properly", () => {
        const { getByRole } = render(
            <ProductsFormComponent
                products={productsMock}
                updateQuantity={defaultMock}
                removeProductFromForm={defaultMock}
            />);
        expect(getByRole("columnheader", { name: "Current cart products" })).toBeInTheDocument();
        expect(getByRole("columnheader", { name: "Product" })).toBeInTheDocument();
        expect(getByRole("columnheader", { name: "Quantity" })).toBeInTheDocument();
        expect(getByRole("columnheader", { name: "Action" })).toBeInTheDocument();

        expect(getByRole("cell", { name: "mock" })).toBeInTheDocument();
        expect(getByRole("textbox")).toHaveDisplayValue("10");
        expect(getByRole("button", { name: "Remove" })).toBeInTheDocument();
    });
    it("can fire update quantity on change", () => {
        const updateQunatityMock = vi.fn();
        const { getByRole } = render(
            <ProductsFormComponent
                products={productsMock}
                updateQuantity={updateQunatityMock}
                removeProductFromForm={defaultMock}
            />);
        fireEvent.change(getByRole("textbox"), { target: { value: "2" } });
        expect(updateQunatityMock).toHaveBeenCalledTimes(1);
        expect(updateQunatityMock).toHaveBeenCalledWith(1, "2");
    });
    it("can fire remove action on click", () => {
        const removeProductMock = vi.fn();
        const { getByRole } = render(
            <ProductsFormComponent
                products={productsMock}
                updateQuantity={defaultMock}
                removeProductFromForm={removeProductMock}
            />);
        fireEvent.click(getByRole("button", { name: "Remove" }));
        expect(removeProductMock).toHaveBeenCalledTimes(1);
        expect(removeProductMock).toHaveBeenCalledWith(1);
    });
});
