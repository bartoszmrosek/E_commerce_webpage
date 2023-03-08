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
    it("changes route to store page", async () => {
        const { getByRole, user } = renderWithRouter(<Navbar />);
        const link = getByRole("link", { name: "Store" });
        await user.click(link);
        expect(document.location.pathname).toEqual("/store");
    });
    it("changes route to dashboard page", async () => {
        const { getByRole, user } = renderWithRouter(<Navbar />, { route: "/store" });
        const link = getByRole("link", { name: "Dashboard" });
        await user.click(link);
        expect(document.location.pathname).toEqual("/dashboard");
    });
});
