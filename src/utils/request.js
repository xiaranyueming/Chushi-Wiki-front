import axios from "axios";
import router from "../router";

const baseUrl = import.meta.env.VITE_BASE_URL

// 创建axios实例
const request = axios.create({
    baseURL: baseUrl,
    timeout: 3000
})


// 请求拦截器
request.interceptors.request.use(config => {
    // 携带token
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
        config.headers['Authorization'] = 'Bearer ' + user.token
    }

    return config
})


// 响应拦截器
request.interceptors.response.use(response => {
    return response.data
}, error => {
    if (error.response.status === 401) {
        // 未登录
        router.push('/login')
    }

    return Promise.reject(error)
})


export default request
