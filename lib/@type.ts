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
    OTHER = 4,
}

export enum _TradeType {
    BUY = 0,
    SELL = 1,
}