import createFetchMock from "vitest-fetch-mock";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { AddNewCartForm } from "./AddNewCartForm";

const newCartResMock = {
    discountedTotal: 300,
    id: 26,
    products: [],
    total: 360,
    totalProducts: 1,
    totalQuantity: 6,
};
const searchResMock = {
    id: 1,
    title: "mock",
};
const defaultMock = vi.fn();
describe("AddNewCartForm", () => {
    it("sends close signal on button click", () => {
        const switchShouldAppearMock = vi.fn();
        const { getByLabelText } = render(
            <AddNewCartForm
                shouldAppear={true}
                switchIsFormDisplayed={switchShouldAppearMock}
                addNewDataToTable={defaultMock}
            />);
        fireEvent.click(getByLabelText("close"));
        expect(switchShouldAppearMock).toHaveBeenCalledTimes(1);
    });

    describe("table operations", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });
        it("should add products to cart from search table", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [searchResMock] }));
            const { getByRole, findByRole, findAllByRole } = render(<AddNewCartForm
                switchIsFormDisplayed={defaultMock}
                addNewDataToTable={defaultMock}
                shouldAppear={true}
            />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: `${searchResMock.title}` } });
                vi.advanceTimersToNextTimer();
            });
            vi.useRealTimers();
            fireEvent.click(await findByRole("button", { name: "Add product" }));
            expect((await findAllByRole("cell", { name: `${searchResMock.title}` }))[1]).toBeInTheDocument();
            expect(await findByRole("textbox")).toHaveDisplayValue(`${searchResMock.id}`);
            expect(await findByRole("button", { name: "Remove" })).toBeInTheDocument();
        });

        it("should add 1 to quantity to same item on second click", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [searchResMock] }));
            const { getByRole, findByRole, findAllByRole } = render(<AddNewCartForm
                switchIsFormDisplayed={defaultMock}
                addNewDataToTable={defaultMock}
                shouldAppear={true}
            />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: `${searchResMock.title}` } });
                vi.advanceTimersToNextTimer();
            });
            vi.useRealTimers();
            const addingBtn = await findByRole("button", { name: "Add product" });
            fireEvent.click(addingBtn);
            fireEvent.click(addingBtn);
            expect((await findAllByRole("cell", { name: `${searchResMock.title}` }))[1]).toBeInTheDocument();
            expect(await findByRole("textbox")).toHaveDisplayValue("2");
            expect(await findByRole("button", { name: "Remove" })).toBeInTheDocument();
        });

        it("should change quantity of only tageted product", async () => {
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ products: [searchResMock, { id: 2, title: "mock2" }] }));
            const { getByRole, findAllByRole } = render(<AddNewCartForm
                switchIsFormDisplayed={defaultMock}
                addNewDataToTable={defaultMock}
                shouldAppear={true}
            />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: `${searchResMock.title}` } });
                vi.advanceTimersToNextTimer();
            });
            vi.useRealTimers();
            const addingBtns = await findAllByRole("button", { name: "Add product" });
            fireEvent.click(addingBtns[0]);
            fireEvent.click(addingBtns[1]);
            const allQuantityInputs = await findAllByRole("textbox");
            fireEvent.change(allQuantityInputs[0], { target: { value: "3" } });
            expect(allQuantityInputs[0]).toHaveDisplayValue("3");
            expect(allQuantityInputs[1]).toHaveDisplayValue("1");
        });
    });

    describe("form operations", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });
        it("should submit form with at least one element and call higher function", async () => {
            const addNewDataToTableMock = vi.fn();
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock
                .mockResponseOnce(JSON.stringify({ products: [searchResMock] }))
                .mockResponseOnce(JSON.stringify(newCartResMock));

            const { getByRole, findByRole } = render(<AddNewCartForm
                switchIsFormDisplayed={defaultMock}
                addNewDataToTable={addNewDataToTableMock}
                shouldAppear={true}
            />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: `${searchResMock.title}` } });
                vi.advanceTimersToNextTimer();
                vi.useRealTimers();
            });
            fireEvent.click(await findByRole("button", { name: "Add product" }));
            fetchMock.mockResponseOnce("");
            await act(async () => {
                fireEvent.click(await findByRole("button", { name: "Confirm adding cart" }));
            });
            expect(addNewDataToTableMock).toHaveBeenCalledTimes(1);
            expect(addNewDataToTableMock).toHaveBeenCalledWith(newCartResMock);
        });

        it("shouldn`t add new cart on failed submit", async () => {
            const addNewDataToTableMock = vi.fn();
            const fetchMock = createFetchMock(vi);
            fetchMock.enableMocks();
            fetchMock
                .mockResponseOnce(JSON.stringify({ products: [searchResMock] }))
                .mockRejectOnce();

            const { getByRole, findByRole } = render(<AddNewCartForm
                switchIsFormDisplayed={defaultMock}
                addNewDataToTable={addNewDataToTableMock}
                shouldAppear={true}
            />);
            act(() => {
                fireEvent.change(getByRole("searchbox"), { target: { value: `${searchResMock.title}` } });
                vi.advanceTimersToNextTimer();
                vi.useRealTimers();
            });
            fireEvent.click(await findByRole("button", { name: "Add product" }));
            fetchMock.mockResponseOnce("");
            await act(async () => {
                fireEvent.click(await findByRole("button", { name: "Confirm adding cart" }));
            });
            expect(addNewDataToTableMock).toHaveBeenCalledTimes(0);
        });
    });
});
