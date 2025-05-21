/**
 * Login
 */
export type LoginRequest = {
    email: string;
    password: string;
}
export type UserLogin = {
    id: number;
    name: string;
    email: string;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    email_verified_at: string;
    creator_id: number | null;
}
export type LoginResponse = {
    token: string;
    user: UserLogin
};

/**
 * Register
 */
export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}

/**
 * Forgot password
 */
export type ForgotPasswordRequest = {
    email: string;
}

/**
 * Verify code
 */
export type VerifyCodeRequest = {
    email: string;
    code: string;
}

/**
 * Reset password
 */
export type ResetPasswordRequest= {
    email: string,
    code: string,
    password: string,
    password_confirmation: string
}