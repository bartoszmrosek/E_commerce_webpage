import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Cart } from "../../types/Cart";
import { DasboardCart } from "./DashboardCart";

const testingCart: Cart = {
    id: 1,
    products: [],
    total: 100,
    discountedTotal: 90,
    totalProducts: 3,
    totalQuantity: 6,
};

describe("DasboardCart", () => {
    it("is rendered with proper cart values", () => {
        const { getByText } = render(<DasboardCart cart={testingCart} />);
        expect(getByText("1")).toBeInTheDocument();
        expect(getByText("3 pieces")).toBeInTheDocument();
        expect(getByText("6 pieces")).toBeInTheDocument();
        expect(getByText("100 €")).toBeInTheDocument();
        expect(getByText("90 €")).toBeInTheDocument();
    });
    it("is not rendering products and quantity on mobile", () => {
        const { queryByText } = render(<DasboardCart cart={testingCart} />);
        window.innerWidth = 500;
        fireEvent.resize(window);
        expect(queryByText("3 pieces")).toBeNull();
        expect(queryByText("6 pieces")).toBeNull();
    });
});
