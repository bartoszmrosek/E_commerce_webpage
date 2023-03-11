import createFetchMock from "vitest-fetch-mock";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { SearchFormComponent } from "./SearchFormComponent";

const defaultMock = vi.fn();
describe("SearchFormComponent", () => {
    it("is rendered properly on initialization", () => {
        const { getByRole } = render(<SearchFormComponent handleNewProduct={defaultMock} />);
        expect(getByRole("searchbox")).toHaveProperty("placeholder", "Start searching for products...");
        expect(getByRole("cell", { name: "Start searching" })).toBeInTheDocument();
    });
    describe("handles all fetch states properly", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });

        it("doesn`t searches with just one letter", () => {
            const { getByRole } = render(<SearchFormComponent handleNewProduct={defaultMock} />);
            fireEvent.change(getByRole("searchbox"), { target: { value: "p" } });
            act(() => {
                vi.advanceTimersToNextTimer();
            });
            expect(getByRole("cell", { name: "Start searching" })).toBeInTheDocument();
        });

        it("searches only after debounce and 2 characters are present", () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            const { getByRole } = render(<SearchFormComponent handleNewProduct={defaultMock} />);
            fireEvent.change(getByRole("searchbox"), { target: { value: "pho" } });
            act(() => {
                vi.advanceTimersToNextTimer();
            });
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock.mock.lastCall).toContain("https://dummyjson.com/products/search?q=pho");
        });
        it("renders beatloader when waiting for fetch to complete", () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            const { getByRole } = render(<SearchFormComponent handleNewProduct={defaultMock} />);
            fireEvent.change(getByRole("searchbox"), { target: { value: "pho" } });
            act(() => {
                vi.advanceTimersToNextTimer();
            });
            expect(getByRole("progressbar")).toBeInTheDocument();
        });

        it("displays information if nothing was found", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [] }));
            const { getByRole, findByText } = render(<SearchFormComponent handleNewProduct={defaultMock} />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: "mock" } });
                vi.advanceTimersByTime(2000);
            });
            vi.useRealTimers();
            expect(await findByText("Couldn`t find any data")).toBeInTheDocument();
        });

        it("displays found products", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [{ id: 1, title: "phone" }] }));
            const { getByRole, findByRole } = render(<SearchFormComponent handleNewProduct={defaultMock} />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: "phone" } });
                vi.advanceTimersToNextTimer();
            });
            vi.useRealTimers();
            expect(await findByRole("cell", { name: "phone" })).toBeInTheDocument();
            expect(await findByRole("button", { name: "Add product" })).toBeInTheDocument();
        });

        it("fires newProductHandler on product button click", async () => {
            const handleNewProductMock = vi.fn();
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [{ id: 1, title: "phone" }] }));
            const { getByRole, findByRole } = render(<SearchFormComponent handleNewProduct={handleNewProductMock} />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: "phone" } });
                vi.advanceTimersToNextTimer();
            });
            vi.useRealTimers();
            fireEvent.click(await findByRole("button", { name: "Add product" }));
            expect(handleNewProductMock).toHaveBeenCalledTimes(1);
            expect(handleNewProductMock).toHaveBeenCalledWith({ id: 1, quantity: "1", title: "phone" });
        });
    });
});
