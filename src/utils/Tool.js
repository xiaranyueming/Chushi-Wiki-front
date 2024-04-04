// 判断对象是否为空
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
}


// 深拷贝
export const copy = (obj) => {
    if (!isEmptyObject(obj)) {
        return JSON.parse(JSON.stringify(obj));
    }
}


// 把分类数据转换成树形结构
export const toTree = (list, parentId) => {
    let result = [];
    for (let i = 0; i < list.length; i++) {
        const node = list[i];
        if (node.parentId === parentId) {
            result.push(node);

            const children = toTree(list, node.id);
            if(!isEmptyObject(children)) {
                node.children = children;
            }
        }
    }
    return result;
}
