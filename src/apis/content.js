import request from "@/utils/request.js";


export const getContentDetailApi = (id) => {
    return request({
        url: `/content/detail/${id}`,
        method: "get",
    });
}



