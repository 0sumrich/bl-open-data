import { group, rollup, sum } from 'd3-array'

const keepKeys = (arr, keys) => arr.map(o => {
    const res = {}
    keys.forEach(k => res[k] = o[k])
    return res
})

function loansByType(initData) {
    const keys = ['Month', 'Type', 'Loans']
    const data = keepKeys(initData.data, keys)
    const groups = Array.from(
        rollup(
            data,
            d => sum(d.map(d => +d.Loans)),
            d => d.Month,
            d => d.Type
        ),
        ([Month, m]) => ({
            Month, data:
                Array.from(m, ([Type, Loans]) => ({ Type, Loans }))
        })
    )
    debugger
}

function writeFigures(data) {
    if (data.length < 1) {
        return []
    }
    const getDataByTitle = title => data[data.map(o => o.title).indexOf(title)]
    // const lbt = loansByType(getDataByTitle('Library loans'))
    const lbt = loansByType(getDataByTitle('Library loans'))
    console.log(lbt)
    return [
        // { data: loansByType(getDataByTitle('Library loans')), layout: { title: 'Loans by item type' } },
        { data: [{ type: 'bar', x: [1, 2, 3], y: [2, 5, 3] }], layout: { title: 'Test chart' } }
    ]
}

export default writeFigures