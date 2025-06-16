import {useQuery} from "@tanstack/react-query";
import accountAPI from "@/api/account";
import useAddAccountStore from "@/lib/store/accountActiveStore";
import {AccountActiveResponse} from "@/api/account/type";
import {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {useMultiQuotePrice} from "@/lib/hooks/useMultiQuotePrice";

export type UseGetAccountActiveHookType = {
    account: AccountActiveResponse['data'] | null;
    accountBalance: number;
    isSuccess: boolean;
    get: () => Promise<any>;
    loading: boolean;
    error: AxiosError | null;
};
const useGetAccountActive = (): UseGetAccountActiveHookType => {
    const {account, setAccount} = useAddAccountStore();
    const [symbols, setSymbols] = useState<string[]>([]);
    const [accountBalance, setAccountBalance] = useState<number>(0);
    const query = useQuery<AccountActiveResponse, AxiosError>({
        queryKey: ['accountAPI-accountActive'],
        queryFn: accountAPI.accountActive,
        enabled: false,
    });

    // Nếu account chưa có thì gọi lại API để lấy thông tin tài khoản đang hoạt động
    useEffect(() => {
        if (!account) {
            query.refetch();
        }
        if (account && account.transactions.length > 0) {
            const uniqueSymbols = Array.from(new Set(account.transactions.map(t => t.symbol)));
            setSymbols(uniqueSymbols);
            setAccountBalance(account.money);
        }
    }, [account]);

    const prices = useMultiQuotePrice(symbols);

    // tính toán số dư tài khoản dựa trên giao dịch và giá hiện tại
    useEffect(() => {
        if (account && account.transactions.length > 0 && Object.keys(prices).length > 0) {
            const totalPrice = account.transactions.reduce((acc, ts) => {
                const symbol = ts.symbol;
                const lot = ts.number;
                const moneyRealTime = prices[symbol]?.price ? parseFloat(prices[symbol].price) : 0;
                return acc + (moneyRealTime * lot);
            }, 0);
            setAccountBalance(account.money + totalPrice);
        }
    }, [account, prices]);


    useEffect(() => {
        if (query.isSuccess && query.data) {
            setAccount(query.data.data);
        }
    }, [query.data, query.isSuccess]);

    return {
        account,
        accountBalance,
        isSuccess: query.isSuccess,
        get: query.refetch,
        loading: query.isLoading || query.isFetching || query.isRefetching,
        error: query.error,
    }
}

export default useGetAccountActive;