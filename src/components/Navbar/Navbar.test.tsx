import { fireEvent } from "@testing-library/react";
import React from "react";
import { renderWithRouter } from "../../../testUtils/renderWithRouter";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
    it("is rendered correctly", () => {
        const { getAllByRole } = renderWithRouter(<Navbar />);
        const links = getAllByRole("link");
        expect(links).toHaveLength(2);
        expect(links.map((e) => e.textContent)).toEqual(["Store", "Dashboard"]);
    });
    it("changes route to store page", () => {
        const { getByRole } = renderWithRouter(<Navbar />);
        const link = getByRole("link", { name: "Store" });
        fireEvent.click(link);
        expect(document.location.pathname).toEqual("/store");
    });
    it("changes route to dashboard page", () => {
        const { getByRole } = renderWithRouter(<Navbar />, { route: "/store" });
        const link = getByRole("link", { name: "Dashboard" });
        fireEvent.click(link);
        expect(document.location.pathname).toEqual("/dashboard");
    });
});
