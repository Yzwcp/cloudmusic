export function deepClone(obj, newObj) {
    newObj = newObj || {};
    for (let key in obj) {
        if (typeof obj[key] == 'object') {
            let isArray = Array.isArray(obj[key]);//判断是否数组
            newObj[key] = (isArray == true ? [] : {})
            deepClone(obj[key], newObj[key]);
        } else {
            newObj[key] = obj[key]
        }
    }
    return newObj;
}
