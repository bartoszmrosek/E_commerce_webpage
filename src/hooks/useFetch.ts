import { useState } from "react";
import { isValidError } from "../utils/isValidError";

interface UseFetchReturn<U> {
    response: U | Error | null;
    isLoading: boolean;
    makeRequest: (options?: RequestInit) => Promise<void>;
}

export const useFetch = <T>(url: URL): UseFetchReturn<T> => {
    const [response, setResponse] = useState<T | Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const makeRequest = async (options?: RequestInit) => {
        setIsLoading(true);
        try {
            const fetchResponse = await fetch(url, options);
            if (!fetchResponse.ok) { throw new Error(`Fetch response not ok`); }
            const fetchResults = fetchResponse.json();
            setResponse(fetchResults as T);
        } catch (error) {
            if (isValidError(error)) {
                setResponse(error);
            } else {
                // eslint-disable-next-line no-console
                console.error(`Fetch was not succesfull: ${error}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return { response, isLoading, makeRequest };
};
