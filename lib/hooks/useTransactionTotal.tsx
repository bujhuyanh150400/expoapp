import {useQuery} from "@tanstack/react-query";
import transactionAPI from "@/api/transaction";
import {create} from "zustand";
import {StoreTransactionResponseType} from "@/api/transaction/type";
import {useEffect} from "react";

export const useTransactionTotal = (account_id: number | null) => {
    const query =  useQuery({
        queryKey: ['transactionAPI-total', account_id],
        enabled: false,
        queryFn: async () => {
            return await transactionAPI.total({
                account_id: account_id || 0,
            });
        },
        select: (res) => res.data
    });
    const {setTotal,total} = useTransactionStore();

    useEffect(() => {
        if (query.data) {
            setTotal(query.data);
        }
    }, [query.data]);
    return {
        query,
        total
    };
};

interface TransactionStore {
    total: StoreTransactionResponseType["data"] | null;
    setTotal: (data: StoreTransactionResponseType["data"]) => void;
}

const useTransactionStore = create<TransactionStore>((set) => ({
    total: null,
    setTotal: (data) => set({ total: data }),
}));