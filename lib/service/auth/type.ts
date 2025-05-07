export interface IReqLoginService {
    username: string;
    password: string;
}

export interface IResLoginService {
    id: number,
    username: string,
    "email": string,
    "firstName": string,
    "lastName": string,
    "gender": string,
    "image": string | null,
    "accessToken": string, // JWT accessToken (for backward compatibility) in response and cookies
    "refreshToken": string // refreshToken in response and cookies
}

export interface IUserAuth {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    image: string | null,
}

export interface IAuthToken {
    accessToken: string,
    refreshToken: string,
}