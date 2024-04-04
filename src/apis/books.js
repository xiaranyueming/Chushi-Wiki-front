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


// 删除书籍
export const deleteBooksApi = (id) => {
    return Request({
        url: `/books/delete/${id}`,
        method: "delete",
    });
}


// 搜索书籍
export const searchBooksApi = (keyWord) => {
    return Request({
        url: "/books/search",
        method: "get",
        params: {
            keyWord
        }
    });
}

