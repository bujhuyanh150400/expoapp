import {create} from "zustand";


interface IUseAppStore {
    loading: boolean;
    setLoading: (state: boolean) => void;
}


const useAppStore = create<IUseAppStore>((set, get) => ({
    loading: false,
    setLoading: (state: boolean) => {
        set({loading: state});
    }
}));

export default useAppStore;
