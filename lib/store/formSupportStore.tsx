import {create} from "zustand/index";
import {CreateTicketRequest} from "@/api/ticket/type";


export type FormSupportStepOne = Pick<CreateTicketRequest, 'type'>;
export type FormSupportStepTwo = Pick<CreateTicketRequest, 'priority' | 'message'>;

interface IFormSupportStore {
    form_step_1: FormSupportStepOne | null,
    setStepOne: (data: FormSupportStepOne) => void,
    clearStepOne: () => void,
}

const formSupportStore = create<IFormSupportStore>((set,get) => ({
    form_step_1: null,
    form_step_2: null,
    setStepOne: (data) => set({form_step_1: data}),
    clearStepOne: () => set({form_step_1: null}),
}));

export default formSupportStore;