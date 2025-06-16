import {create} from "zustand/index";
import {Account} from "@/api/account/type";

interface IAddAccountStore {
    account: Account | null;
    setAccount: (account: Account) => void;

}

const useAddAccountStore = create<IAddAccountStore>((set, get) => ({
    account: null,
    setAccount: (account: Account) => set({account: account})
}));

export default useAddAccountStore;