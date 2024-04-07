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


// 通过书籍id获取文档列表
export const getDocListByBookIdApi = (bookId) => {
    return Request({
        url: `/doc/${bookId}`,
        method: "get",
    });
}


// 点赞
export const voteDocApi = (docId) => {
    return Request({
        url: `/doc/vote/${docId}`,
        method: "get",
    });
}


