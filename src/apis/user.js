import Request from "@/utils/request.js";


// 登录
export const loginApi = (data) => {
    return Request({
        url: "/user/login",
        method: "post",
        data
    });
}



// 注册
export const registerApi = (data) => {
    return Request({
        url: "/user/register",
        method: "post",
        data
    });
}



// 重置密码
export const resetPasswordApi = (data) => {
    return Request({
        url: "/user/reset",
        method: "post",
        data
    });
}
