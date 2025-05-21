import {create} from 'zustand';

interface IForgotPassStorage {
    email: string | null,
    code: string | null,

    setEmail: (email: string) => void,
    setCode: (code: string) => void,
    setEmpty: () => void,
}

const useForgotPassStore = create<IForgotPassStorage>((set, get) => ({
    email: null,
    code: null,
    setEmail: (email: string) => {
        set({email});
    },
    setCode: (code: string) => {
        set({code});
    },
    setEmpty: () => set({email: null, code: null}),
}));
export default useForgotPassStore
