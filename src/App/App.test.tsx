import React from "react";
import { renderWithRouter } from "../../testUtils/renderWithRouter";
import { App } from "./App";

describe("App", () => {
    it("renders NotFound component on bad location", () => {
        const { getByText } = renderWithRouter(<App />, { route: "/wrongAddress" });
        expect(getByText("Site not found. Maybe address is wrong?"));
    });
    it("render store component on /store route", () => {
        const { getByText } = renderWithRouter(<App />, { route: "/store" });
        expect(getByText("Not implemented yet. Checkout dashboard for now!")).toBeInTheDocument();
    });
    it("renders dashboard on /dashboard route", () => {
        const { getByText } = renderWithRouter(<App />, { route: "/dashboard" });
        expect(getByText("All carts")).toBeInTheDocument();
    });
    it("handles lazy loading SingleCart component", async () => {
        const { getByTestId, findByText } = renderWithRouter(<App />, { route: "/dashboard/cart/1" });
        const mainLoader = getByTestId("mainProgressBar");
        expect(mainLoader).toBeInTheDocument();
        expect(await findByText("Cart 1")).toBeInTheDocument();
        expect(mainLoader).not.toBeInTheDocument();
    });
});
