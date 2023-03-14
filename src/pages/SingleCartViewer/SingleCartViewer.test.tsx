import createFetchMock from "vitest-fetch-mock";
import React, {} from "react";
import { vi } from "vitest";
import { Routes, Route } from "react-router-dom";
import { fireEvent } from "@testing-library/react";
import { renderWithRouter } from "../../../testUtils/renderWithRouter";
import SingleCartViewer from "./SingleCartViewer";
import { CartProduct } from "../../types/CartProduct";

const SpecialRouterWrapper = () => (
    <Routes>
        <Route path="dashboard/cart/:cartId" element={<SingleCartViewer />} />
    </Routes>
);

describe("SingleCartViewer", () => {
    it("displays proper message if cart route is wrong", () => {
        const { getByRole } = renderWithRouter(<SingleCartViewer />, { route: "/dashboard/cart/wrongroute" });
        expect(getByRole("heading", { name: "Cart not found" })).toBeInTheDocument();
    });
    describe("handles fetch results properly", () => {
        it("displays loading component while fetch is not pending", () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(() => "a");
            const { getByRole } = renderWithRouter(<SpecialRouterWrapper />, { route: "/dashboard/cart/1" });
            expect(getByRole("progressbar")).toBeInTheDocument();
        });
        describe("handles errors properly", () => {
            it("displays additional informations on error", async () => {
                const fetchMock = createFetchMock(vi);
                fetchMock.enableMocks();
                fetchMock.mockReject(new Error());
                const { findByRole, findByText } = renderWithRouter(<SpecialRouterWrapper />, { route: "/dashboard/cart/1" });
                expect(await findByText("Couldn`t load data. Please retry")).toBeInTheDocument();
                expect(await findByRole("button", { name: "Try again" })).toBeInTheDocument();
            });
            it("retries on try again button", async () => {
                const fetchMock = createFetchMock(vi);
                fetchMock.enableMocks();
                fetchMock.mockReject(new Error());
                const { findByRole } = renderWithRouter(<SpecialRouterWrapper />, { route: "/dashboard/cart/1" });
                fireEvent.click(await findByRole("button", { name: "Try again" }));
                expect(fetchMock).toHaveBeenCalledTimes(2);
            });
        });
        it("displays information if cart is empty", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [] }));
            const { findByText } = renderWithRouter(<SpecialRouterWrapper />, { route: "/dashboard/cart/1" });
            expect(await findByText("Cart is empty")).toBeInTheDocument();
        });
        // due to how rechart works I am not testing its implementation as it wouldn`t work or would have been mocked in most of it`s functionalities
        it("displays table on successfull fetch", async () => {
            window.ResizeObserver = vi.fn().mockImplementation(() => ({
                observe: vi.fn(),
                unobserve: vi.fn(),
                disconnect: vi.fn(),
            }));

            const testingCart: CartProduct = {
                id: 1,
                quantity: 2,
                discountedPrice: 20,
                price: 30,
                discountPercentage: 20,
                title: "mocked",
                total: 60,
            };

            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [testingCart] }));
            const { findByRole } = renderWithRouter(<SpecialRouterWrapper />, { route: "/dashboard/cart/1" });
            expect(await findByRole("cell", { name: "mocked" })).toBeInTheDocument();
        });
    });
});
