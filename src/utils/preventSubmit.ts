import { KeyboardEvent } from "react";
// Just to make sure any accidential enter wouldn`t trigger whole form submit.
export const preventFormSubmit = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") { e.preventDefault(); }
};
