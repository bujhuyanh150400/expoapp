import DefaultColor from "@/components/ui/DefaultColor";

/**
 * Auth types
 */
export enum _AuthStatus {
    NEED_ACCESS_PIN = 'need_access_pin',
    AUTHORIZED = 'authorized',
    UNAUTHORIZED = 'unauthorized',
}


/**
 * Account types
 */
export enum _AccountType {
    TEST_ACCOUNT = 0,
    REAL_ACCOUNT = 1,
}

/**
 * Time frame types
 */
export enum _Timeframe {
    OneMinute = '1min',
    FifteenMinutes = '15min',
    ThirtyMinutes = '30min',
    FortyFiveMinutes = '45min',
    OneHour = '1h',
    OneDay = '1day',
    OneWeek = '1week',
}

/**
 * Verìfy user status types
 */
export enum _VerifyUserStatus {
    ACTIVE = 1,
    INACTVE = 2,
    WAITING = 3,
}

export enum _AssetType {
    CRYPTO = 1,
    ENERGY = 2,
    METAL = 3,
    FAVORITE = 4,
}

export enum _TradeType {
    BUY = 0,
    SELL = 1,
}

export enum _SupportTicketType {
    TECHNICAL = 1,
    PAYMENT = 2,
    TRANSACTION = 3,
}

export enum _SupportTicketStatus {
    OPEN = 1,
    CLOSED = 2,
}

export enum _SupportTicketSenderType {
    USER = 1,
    AGENT = 2,
}

export enum _SupportTicketPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

export const PRIORITY_CONFIG = {
    [_SupportTicketPriority.LOW]: {
        text: 'Thấp',
        color: DefaultColor.green[200],
    },
    [_SupportTicketPriority.MEDIUM]: {
        text: 'Trung bình',
        color: DefaultColor.yellow[200],
    },
    [_SupportTicketPriority.HIGH]: {
        text: 'Cao',
        color: DefaultColor.red[200],
    },
};