import { fireEvent } from "@testing-library/react";
import React from "react";
import { renderWithRouter } from "../../../testUtils/renderWithRouter";
import { NotFound } from "./NotFound";

describe("NotFound", () => {
    it("is rendered properly", () => {
        const { getByText } = renderWithRouter(<NotFound />);
        expect(getByText("Site not found. Maybe address is wrong?")).toBeInTheDocument();
    });
    it("returns to dasboard on btn click", () => {
        const { getByRole } = renderWithRouter(<NotFound />);
        const btn = getByRole("button", { name: "Return to dashboard" });
        fireEvent.click(btn);
        expect(document.location.pathname).toBe("/dashboard");
    });
});
