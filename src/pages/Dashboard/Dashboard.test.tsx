import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

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
            fetchMock.mockRejectOnce(new Error("error"));
            const { findByRole, findByText } = render(<Dashboard />);
            expect(await findByText("Loading data failed")).toBeInTheDocument();
            const retryBtn = await findByRole("button", { name: "Retry" });
            expect(retryBtn).toBeInTheDocument();
            fireEvent.click(retryBtn);
            // It is actually 2 but Stric mode makes it double
            expect(fetchMock).toBeCalledTimes(4);
        });

        it("displays loading component if not fetched yet", () => {
            fetchMock.mockResponse(() => "a");
            const { getByRole, getByText } = render(<Dashboard />);
            expect(getByRole("progressbar")).toBeInTheDocument();
            expect(getByText("Loading data...")).toBeInTheDocument();
        });

        it("displays proper table data after succesfull fetch", async () => {
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
            fetchMock.mockResponseOnce(JSON.stringify({ ...mockResponseObj, carts: [] }));
            const { findByText } = render(<Dashboard />);
            expect(await findByText("No carts can be found! Add some!")).toBeInTheDocument();
        });
    });
});