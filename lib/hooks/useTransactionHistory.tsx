import {create} from "zustand";
import {Transaction, TransactionHistoryRequestType} from "@/api/transaction/type";
import {_TransactionStatus} from "@/lib/@type";
import transactionAPI from "@/api/transaction";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";


const useTransactionHistory = (params: TransactionHistoryRequestType) => {
    const query = useQuery({
        queryKey: ['transactionAPI-history', params],
        enabled: !!params.account_id,
        queryFn: async () => await transactionAPI.history(params),
        select: (res) => res.data,
    });
    const {data, setTransactions} = useTransactionHistoryStore();
    useEffect(() => {
        if (query.data) {
            setTransactions(params.status, query.data);
        }
    }, [query.data]);

    return {
        query,
        transactions: data,
    };
}

export default useTransactionHistory;


interface TransactionHistoryStore {
    data: Record<_TransactionStatus, Transaction[]>;
    setTransactions: (status: _TransactionStatus, transactions: Transaction[]) => void;
}

const useTransactionHistoryStore = create<TransactionHistoryStore>((set, get) => ({
    data: {
        [_TransactionStatus.OPEN]: [],
        [_TransactionStatus.CLOSED]: [],
        [_TransactionStatus.WAITING]: [],
    },
    setTransactions: (status, transactions) => {
        set((state) => ({
            data: {
                ...state.data,
                [status]: transactions,
            },
        }));
    },
}));