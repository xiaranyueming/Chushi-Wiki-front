import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL

// 创建axios实例
const request = axios.create({
    baseURL: baseUrl,
    timeout: 3000
})


// 请求拦截器
request.interceptors.request.use(config => {
    return config
})


// 响应拦截器
request.interceptors.response.use(response => {
    return response.data
})


export default request
