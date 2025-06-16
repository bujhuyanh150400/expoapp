import {_AccountType} from "@/lib/@type";
import {AccountType, CurrencyType, Lever} from "@/api/common/type";

export type CreateAccountRequest = {
    user_id: number;
    name: string | null | undefined;// tên tài khoản
    password: string; // mật khẩu tài khoản
    currency_id: number; // loai tiền tệ
    lever_id: number; // tỷ lệ đòn bẩy
    account_type_id: number; // id loại tài khoản
    account_type: _AccountType;  // loại tài khoản: REAL_ACCOUNT, CREDIT_ACCOUNT
};
export type AccountListResponse = {
    message: string;
    data: Account[];
};
export type AccountActiveResponse = {
    message: string;
    data: Account;
};
export type Account = {
    id: number;
    code: string;
    account_type_id: number;
    currency_id: number;
    lever_id: number;
    name: string;
    money: number;
    profit: number;
    type: _AccountType;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    account_type: AccountType; // Thông tin loại tài khoản
    currency: CurrencyType;
    lever: Lever
    transactions: TransactionType[]; // Danh sách giao dịch liên quan đến tài khoản
};

export type TransactionType = {
    "id": number,
    "account_id": number,
    "parent_id": number,
    "currency": string,
    "type": number,
    "number": number,
    "price_buy": string,
    "price_sell": string,
    "profit": string,
    "symbol": string,
    "message": null,
    "status": number,
    "created_at": string,
    "updated_at": string
}


export type RechargeAccountRequest = {
    account_id: number; // id tài khoản
    money: number; // số tiền nạp vào tài khoản
}