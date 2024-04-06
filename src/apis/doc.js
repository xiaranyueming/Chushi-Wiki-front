import Request from "@/utils/request.js";

// 获取图书列表
export const getDocListApi = () => {
    return Request({
        url: "/doc/list",
        method: "get",
    });
}


// 保存文档
export const saveDocApi = (data) => {
    return Request({
        url: "/doc/save",
        method: "post",
        data,
    });
}


// 删除文档
export const deleteDocApi = (ids) => {
    return Request({
        url: `/doc/delete/`+ids.join(','), // 注意这里的写法，数组转字符串（逗号分隔）
        method: "delete",
    });
}


// 搜索文档
export const searchDocApi = (keyWord) => {
    return Request({
        url: "/doc/search",
        method: "get",
        params: {
            keyWord
        }
    });
}

