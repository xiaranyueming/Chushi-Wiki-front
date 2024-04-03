import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:8080',
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
