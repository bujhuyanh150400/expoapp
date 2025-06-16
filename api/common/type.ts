
export type AccountType = {
    id: number; // id loại tài khoản
    name: string; // tên loại tài khoản
    description: string; // mô tả chi tiết về loại tài khoản
    summary: string; // mô tả ngắn gọn về loại tài khoản
    min: string; // số tiền tối thiểu để mở tài khoản
    max: string; // số tiền tối đa để mở tài khoản
    difference: string; // số tiền chênh lệch giữa các loại tài khoản
    commission: string; // hoa hồng giao dịch
    color?: string
};
export type AccountTypeListResponse = {
    data: AccountType[];
    message: string;
};

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

export type Bank = {
    code: string;
    name: string;
    short_name: string;
    bin: string;
}

export type ListBankResponse = {
    data: Bank[];
    message: string;
}