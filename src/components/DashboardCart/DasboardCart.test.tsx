import React from "react";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { Cart } from "../../types/Cart";
import { DasboardCart } from "./DashboardCart";
import { renderWithRouter } from "../../../testUtils/renderWithRouter";

const testingCart: Cart = {
    id: 1,
    products: [],
    total: 100,
    discountedTotal: 90,
    totalProducts: 3,
    totalQuantity: 6,
};

const defaulMock = vi.fn();
describe("DasboardCart", () => {
    it("is rendered with proper cart values", () => {
        const { getByText } = renderWithRouter(<DasboardCart cart={testingCart} handleCartRemove={defaulMock} />);
        expect(getByText("1")).toBeInTheDocument();
        expect(getByText("3 pieces")).toBeInTheDocument();
        expect(getByText("6 pieces")).toBeInTheDocument();
        expect(getByText("100 €")).toBeInTheDocument();
        expect(getByText("90 €")).toBeInTheDocument();
    });
    it("is not rendering products and quantity on mobile", () => {
        const { queryByText } = renderWithRouter(<DasboardCart cart={testingCart} handleCartRemove={defaulMock} />);
        window.innerWidth = 500;
        fireEvent.resize(window);
        expect(queryByText("3 pieces")).toBeNull();
        expect(queryByText("6 pieces")).toBeNull();
    });
    describe("handles all delete fetch states", () => {
        it("displays loader when not finished", () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({}));
            const { getByRole } = renderWithRouter(<DasboardCart cart={testingCart} handleCartRemove={defaulMock} />);
            fireEvent.click(getByRole("button", { name: "Delete" }));
            expect(getByRole("progressbar")).toBeInTheDocument();
        });
        it("displays error msg on rejected request", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockRejectOnce(new Error());
            const handleRemoveMock = vi.fn();
            const { getByRole, findByRole } = renderWithRouter(<DasboardCart cart={testingCart} handleCartRemove={handleRemoveMock} />);
            act(() => {
                fireEvent.click(getByRole("button", { name: "Delete" }));
            });
            expect(await findByRole("button", { name: "Couldn`t delete" }));
            expect(handleRemoveMock).toHaveBeenCalledTimes(0);
        });
        it("fires higher removing function on successfull fetch", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ id: testingCart.id, isDeleted: true }));
            const handleRemoveMock = vi.fn();
            const { getByRole } = renderWithRouter(<DasboardCart cart={testingCart} handleCartRemove={handleRemoveMock} />);
            act(() => {
                fireEvent.click(getByRole("button", { name: "Delete" }));
            });
            await waitFor(() => {
                expect(handleRemoveMock).toHaveBeenCalledTimes(1);
                expect(handleRemoveMock).toHaveBeenCalledWith(testingCart.id);
            });
        });
    });
    it("redirects to proper route on view btn click", () => {
        const { getByRole } = renderWithRouter(<DasboardCart cart={testingCart} handleCartRemove={defaulMock} />);
        fireEvent.click(getByRole("button", { name: "View" }));
    });
});
