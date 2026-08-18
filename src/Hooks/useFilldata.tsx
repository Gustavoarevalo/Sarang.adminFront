import { useState } from 'react';
export const useFillData = <T extends object>(initialData: T) => {
    const [data, setData] = useState<T>(initialData);
    const updateData = async <K extends keyof T>(value: T[K], field: K) =>
        setData(prevdata => ({
            ...prevdata,
            [field]: value,
        }));
    return {
        data,
        updateData,
    };
};