// 判断对象是否为空
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
}


export const copy = (obj) => {
    if (!isEmptyObject(obj)) {
        return JSON.parse(JSON.stringify(obj));
    }
}
