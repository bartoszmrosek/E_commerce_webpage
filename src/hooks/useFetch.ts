import { useCallback, useState } from "react";
import { isValidError } from "../utils/isValidError";

interface UseFetchReturn<U> {
    response: U | Error | null;
    isLoading: boolean;
    makeRequest: (options?: RequestInit) => Promise<void>;
}

export const useFetch = <T>(url: string): UseFetchReturn<T> => {
    const [response, setResponse] = useState<T | Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const makeRequest = useCallback(async (options?: RequestInit) => {
        setIsLoading(true);
        try {
            const fetchResponse = await fetch(url, { ...options });
            if (!fetchResponse.ok) { throw new Error(`Fetch response not ok`); }
            const fetchResults: unknown = await fetchResponse.json();
            setResponse(fetchResults as T);
            setIsLoading(false);
        } catch (error) {
            if (isValidError(error)) {
                if (error.name !== "AbortError") { setIsLoading(false); }
                setResponse(error);
            } else {
                // eslint-disable-next-line no-console
                console.error(`Fetch was not succesfull: ${error}`);
            }
        }
    }, [url]);

    return { response, isLoading, makeRequest };
};
