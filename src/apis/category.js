import Request from "@/utils/request.js";

// 获取图书列表
export const getCategoryListApi = () => {
    return Request({
        url: "/category/list",
        method: "get",
    });
}


// 保存分类
export const saveCategoryApi = (data) => {
    return Request({
        url: "/category/save",
        method: "post",
        data,
    });
}


// 删除分类
export const deleteCategoryApi = (id) => {
    return Request({
        url: `/category/delete/${id}`,
        method: "delete",
    });
}


// 搜索分类
export const searchCategoryApi = (keyWord) => {
    return Request({
        url: "/category/search",
        method: "get",
        params: {
            keyWord
        }
    });
}

