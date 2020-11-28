export const keepKeys = (arr, keys) => arr.map(o => {
    const res = {};
    keys.forEach(k => res[k] = o[k]);
    return res;
});
export const unpack = (arr, key) => arr.map(o => o[key]);
export const makeId = str => str.replace(/\s+/g, '-').toLowerCase()
export const getDataByTitle = (data, title) => data[data.map(o => o.title).indexOf(title)]