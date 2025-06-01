import {_AccountType} from "@/lib/@type";

export type CurrencyType = {
    id: number;
    country: string;
    currency: string;
    status: number;
    created_at: string;
    updated_at: string | null;
};

export type CurrencyResponse = {
    data: CurrencyType[];
    message: string;
};

export type Lever = {
    id: number;
    min: number;
    max: string; // Có thể là số dạng chuỗi hoặc chuỗi đặc biệt như "Không giới hạn"
    type: string | null; // Có thể là chuỗi hoặc null
    check: any; // Nếu bạn biết chắc kiểu dữ liệu thì thay `any` cho cụ thể (ví dụ: boolean | null)
    status: boolean;
    created_at: string;
    updated_at: string | null;
};

export type LeverResponse = {
    data: Lever[];
    message: string;
};

export type CreateAccountRequest = {
    user_id: number;
    name: string | null | undefined;// tên tài khoản
    password: string; // mật khẩu tài khoản
    currency_id: number; // loai tiền tệ
    lever_id: number; // tỷ lệ đòn bẩy
    account_type_id: number; // id loại tài khoản
    account_type: _AccountType;  // loại tài khoản: REAL_ACCOUNT, CREDIT_ACCOUNT
};

export type AccountType = {
    id: number; // id loại tài khoản
    name: string; // tên loại tài khoản
    description: string; // mô tả chi tiết về loại tài khoản
    summary: string; // mô tả ngắn gọn về loại tài khoản
    min: string; // số tiền tối thiểu để mở tài khoản
    max: string; // số tiền tối đa để mở tài khoản
    difference: string; // số tiền chênh lệch giữa các loại tài khoản
    commission: string; // hoa hồng giao dịch
};
export type AccountTypeListResponse = {
    data: AccountType[];
    message: string;
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
};

export type RechargeAccountRequest = {
    account_id: number; // id tài khoản
    money: number; // số tiền nạp vào tài khoản
}