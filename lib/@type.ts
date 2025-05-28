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