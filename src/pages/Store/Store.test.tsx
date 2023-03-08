import React from "react";
import { render } from "@testing-library/react";
import { Store } from "./Store";

describe("Store", () => {
    it("is rendered correctly", () => {
        const { getByText } = render(<Store />);
        expect(getByText("Not implemented yet. Checkout dashboard for now!")).toBeInTheDocument();
    });
});
