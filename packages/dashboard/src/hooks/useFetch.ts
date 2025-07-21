import { useCallback, useEffect, useState } from "react";
const API_BASE_PATH = 'http://localhost:3000';

const TEST = new Array(10).fill({}).map((_, index) => ({
    id: index,
    title: `Chat history data ${index} `.repeat(index),
}));

export const useFetch = <FetchResponse extends any>(path?: string) => {
    const [isLoading, setLoading] = useState(false);
    const [res, setRes] = useState<FetchResponse | undefined>(undefined);
    const fetcher = useCallback(async (_path: string) => {
        try {
            setRes(TEST as any);
            return;
            const result = await fetch(`${API_BASE_PATH}${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json"
                }
            }).then((response) => response.json())
            setRes(result)
        }
        catch (e) {
            setRes(undefined)
        } finally {
            setLoading(false);

        }
    }, [])

    useEffect(() => {
        setLoading(true)
        if (!path) {
            setLoading(false);
            return;
        }
        fetcher(path)
    }, [])

    return {
        isLoading,
        data: res
    };
}