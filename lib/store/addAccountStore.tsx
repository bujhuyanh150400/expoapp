import {create} from 'zustand';
import {CreateAccountRequest} from "@/api/account/type";


type FormAddAccount = Omit<CreateAccountRequest, 'password'>;

interface IAddAccountStore {
    form: FormAddAccount,
    setStepOne: (data: Pick<FormAddAccount, 'account_type'>) => void,
    clearStepOne: () => void,
    setStepTwo: (data: Pick<FormAddAccount, 'currency_id' | 'name' | 'lever_id'>) => void,
    clearStepTwo: () => void,
}