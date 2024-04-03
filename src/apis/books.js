import Request from "@/utils/request.js";

// 获取图书列表
export const getBooksListApi = () => {
    return Request({
        url: "/books/list",
        method: "get",
    });
}
