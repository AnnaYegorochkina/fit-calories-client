export function getObjectByPath(pathArray, o) {
    return pathArray.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : null, o)
}

export function reduxAction(obj, type, payload) {
    return {
        type: `${obj}/${type}`,
        payload: isObject(payload) ? {...payload} : payload,
    }
}

export function isObject(a) {
    return (!!a) && (a.constructor === Object);
}
