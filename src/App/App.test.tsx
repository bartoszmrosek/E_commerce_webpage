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
    it.todo("handles lazy loading SingleCart component", () => {
    });
});
