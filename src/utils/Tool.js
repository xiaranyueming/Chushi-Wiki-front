// 判断对象或列表是否为空
export const isEmptyObject = (obj) => {
    if (obj === null || obj === undefined) {
        return true;
    }
    if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }
    return false;
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




// 设置节点及其子孙节点为disabled
export const setDisabled = (list, id) => {
    for (let i = 0; i < list.length; i++) {
        const node = list[i];
        if (node.id === id) {
            // 设置为disabled
            node.disabled = true;

            const children = node.children;
            if (!isEmptyObject(children)) {
                // 递归设置子孙节点为disabled
                for (let j = 0; j < children.length; j++) {
                    setDisabled(children, children[j].id);
                }
            }
        } else {
            const children = node.children;
            if (!isEmptyObject(children)) {
                setDisabled(children, id);
            }
        }
    }
}



