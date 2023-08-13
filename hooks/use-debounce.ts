import { useEffect, useState } from 'react';


//Takes in the search query of the use, which is the value, and the time required to pass in order to use the query to search the database
//So, as a default, 500 milliseconds needs to pass after the user typed a query in order to search the database
export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
};