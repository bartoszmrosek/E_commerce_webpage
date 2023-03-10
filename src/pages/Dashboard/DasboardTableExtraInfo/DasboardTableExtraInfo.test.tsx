import { render } from "@testing-library/react";
import React from "react";
import { DashboardTableExtraInfo } from "./DasboardTableExtraInfo";

describe("DashboardTableExtraInfo", () => {
    it("is rendered correctly with props", () => {
        const { getByText } = render(<DashboardTableExtraInfo><p>Testing text</p></DashboardTableExtraInfo>);
        expect(getByText("Testing text")).toBeInTheDocument();
    });
});
