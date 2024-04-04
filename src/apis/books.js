import Request from "@/utils/request.js";

// 获取图书列表
export const getBooksListApi = () => {
    return Request({
        url: "/books/list",
        method: "get",
    });
}


// 保存书籍
export const saveBooksApi = (data) => {
    return Request({
        url: "/books/save",
        method: "post",
        data,
    });
}
