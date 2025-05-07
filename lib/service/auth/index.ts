import {IAuthToken, IReqLoginService, IResLoginService, IUserAuth} from "@/lib/service/auth/type";
import BaseAPI from "@/lib/utils/BaseAPI";


export const loginService = async (payload: IReqLoginService): Promise<{
    user: IUserAuth,
    token: IAuthToken,
}> => {
    const res = await BaseAPI.post('/auth/login', payload);
    const data: IResLoginService = res.data;
    return {
        user: {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
        },
        token: {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        }
    };
}