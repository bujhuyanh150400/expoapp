import {create} from 'zustand';
import {CreateAccountRequest} from "@/api/account/type";



export type FormAddAccountStepOne = Pick<CreateAccountRequest, 'account_type'>;
export type FormAddAccountStepTwo = Pick<CreateAccountRequest, 'account_type_id'>;
export type FormAddAccountStepThree = Pick<CreateAccountRequest, 'currency_id' | 'name' | 'lever_id'> ;

interface IAddAccountStore {
    form_step_1: FormAddAccountStepOne | null,
    form_step_2: FormAddAccountStepTwo | null,
    form_step_3: FormAddAccountStepThree | null,
    setStepOne: (data: FormAddAccountStepOne) => void,
    clearStepOne: () => void,
    setStepTwo: (data: FormAddAccountStepTwo) => void,
    clearStepTwo: () => void,
    setStepThree: (data: FormAddAccountStepThree) => void,
    clearStepThree: () => void,
}
 const useAddAccountStore = create<IAddAccountStore>((set,get) => ({
    form_step_1: null,
    form_step_2: null,
    form_step_3: null,

    setStepOne: (data) => set({form_step_1: data}),
    clearStepOne: () => set({form_step_1: null}),

    setStepTwo: (data) => set({form_step_2: data}),
    clearStepTwo: () => set({form_step_2: null}),

    setStepThree: (data) => set({form_step_3: data}),
    clearStepThree: () => set({form_step_3: null}),

}));

export default useAddAccountStore;