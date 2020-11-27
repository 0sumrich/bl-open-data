export const keepKeys = (arr, keys) => arr.map(o => {
    const res = {};
    keys.forEach(k => res[k] = o[k]);
    return res;
});
export const unpack = (arr, key) => arr.map(o => o[key]);
