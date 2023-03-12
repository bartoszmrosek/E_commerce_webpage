import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

const mockResponseObj = {
    carts: [{ discountedTotal: 1900, id: 1, products: [], total: 2300, totalProducts: 3, totalQuantity: 5 }],
    total: 20,
    skip: 0,
    limit: 20,
};

describe("Dashboard", () => {
    describe("renders", () => {
        afterAll(() => {
            window.innerWidth = 1080;
            fireEvent.resize(window);
        });
        it("renders not async data on desktop", () => {
            const { getByText, getByRole } = render(<Dashboard />);
            expect(getByText("All carts")).toBeInTheDocument();
            expect(getByRole("columnheader", { name: "Cart id" })).toBeInTheDocument();
            expect(getByRole("columnheader", { name: "Total products" })).toBeInTheDocument();
            expect(getByRole("columnheader", { name: "Total quantity" })).toBeInTheDocument();
            expect(getByRole("columnheader", { name: "Total" })).toBeInTheDocument();
            expect(getByRole("columnheader", { name: "After discount" })).toBeInTheDocument();
            expect(getByRole("button", { name: "Add new cart" })).toBeInTheDocument();
        });
        it("renders not async data on mobile", () => {
            const { queryByRole } = render(<Dashboard />);
            window.innerWidth = 500;
            fireEvent.resize(window);
            expect(queryByRole("columnheader", { name: "Total products" })).toBeNull();
            expect(queryByRole("columnheader", { name: "Total quantity" })).toBeNull();
        });
    });
    describe("updates ui based on fetch state", () => {
        it("displays error component on failed fetch and fires retry after click", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockRejectOnce(new Error("error"));
            const { findByRole, findByText } = render(<Dashboard />);
            expect(await findByText("Loading data failed")).toBeInTheDocument();
            const retryBtn = await findByRole("button", { name: "Retry" });
            expect(retryBtn).toBeInTheDocument();
            fireEvent.click(retryBtn);
            expect(fetchMock).toBeCalledTimes(2);
        });

        it("displays loading component if not fetched yet", () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponse(() => "a");
            const { getByRole, getByText } = render(<Dashboard />);
            expect(getByRole("progressbar")).toBeInTheDocument();
            expect(getByText("Loading data...")).toBeInTheDocument();
        });

        it("displays proper table data after succesfull fetch", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify(mockResponseObj));
            const { findByRole } = render(<Dashboard />);
            expect(await findByRole("cell", { name: "1" })).toBeInTheDocument();
            expect(await findByRole("cell", { name: "1900 €" })).toBeInTheDocument();
            expect(await findByRole("cell", { name: "2300 €" })).toBeInTheDocument();
            expect(await findByRole("cell", { name: "3 pieces" })).toBeInTheDocument();
            expect(await findByRole("cell", { name: "5 pieces" })).toBeInTheDocument();
            expect(await findByRole("button", { name: "View" })).toBeInTheDocument();
            expect(await findByRole("button", { name: "Delete" })).toBeInTheDocument();
        });

        it("displays additional info if no data was found on server", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ ...mockResponseObj, carts: [] }));
            const { findByText } = render(<Dashboard />);
            expect(await findByText("No carts can be found! Add some!")).toBeInTheDocument();
        });
    });
    it("checks if button opens form", () => {
        const { getByRole } = render(<Dashboard />);
        fireEvent.click(getByRole("button", { name: "Add new cart" }));
        const formHeader = getByRole("heading", { name: "New cart" });
        expect(formHeader).toBeInTheDocument();
        expect(formHeader.parentElement?.parentElement).toHaveClass("wrapperIsVisible");
    });
    it("checks if new cart can be added after form submit", async () => {
        const mockedAddingRes = {
            discountedTotal: 300,
            id: 26,
            products: [],
            total: 360,
            totalProducts: 1,
            totalQuantity: 6,
        };

        const fetchMock = createFetchMock(vi);
        fetchMock.enableMocks();

        fetchMock.mockResponseOnce(JSON.stringify(mockResponseObj));
        const { getByRole, findByRole } = render(<Dashboard />);
        fireEvent.click(getByRole("button", { name: "Add new cart" }));
        fetchMock.mockResponseOnce(JSON.stringify(mockedAddingRes));
        fireEvent.click(await findByRole("button", { name: "Confirm adding cart" }));
        expect(await findByRole("cell", { name: "26" })).toBeInTheDocument();
        expect(await findByRole("cell", { name: "1 pieces" })).toBeInTheDocument();
        expect(await findByRole("cell", { name: "6 pieces" })).toBeInTheDocument();
        expect(await findByRole("cell", { name: "360 €" })).toBeInTheDocument();
        expect(await findByRole("cell", { name: "300 €" })).toBeInTheDocument();
    });
    it("delets cart from dashboard on cart btn click", async () => {
        const fetchMock = createFetchMock(vi);
        fetchMock.enableMocks();
        fetchMock
            .mockResponseOnce(JSON.stringify(mockResponseObj))
            .mockResponseOnce(JSON.stringify({ id: mockResponseObj.carts[0].id, isDeleted: true }));
        const { findByRole } = render(<Dashboard />);
        const cart = await findByRole("cell", { name: `${mockResponseObj.carts[0].id}` });
        await act(async () => {
            fireEvent.click(await findByRole("button", { name: "Delete" }));
        });
        await waitFor(() => {
            expect(cart).not.toBeInTheDocument();
        });
    });
});
