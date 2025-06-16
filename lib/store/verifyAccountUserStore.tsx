import {create} from "zustand/index";
import {VerifyUserRequest} from "@/api/auth/type";


export type FormVerifyAccountStepOne = Omit<VerifyUserRequest, 'cccd_front_image' | 'cccd_back_image'>;

interface IVerifyAccountUserStore {
    form_step_1: FormVerifyAccountStepOne | null,
    setStepOne: (data: FormVerifyAccountStepOne) => void,
    clearStepOne: () => void,
}


const useVerifyAccountUserStore = create<IVerifyAccountUserStore>((set,get) => ({
    form_step_1: null,
    setStepOne: (data) => set({form_step_1: data}),
    clearStepOne: () => set({form_step_1: null}),
}));

export default useVerifyAccountUserStore;