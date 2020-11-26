// function loansByType(data){

// }

function writeFigures(data) {
    const getDataByTitle = title => data[data.map(o => o.title).indexOf(title)]

    return [
        // { data: loansByType(getDataByTitle('Library loans')), layout: { title: 'Loans by item type' } },
        { data: { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] }, layout: { title: 'Test chart' } }
    ]
}

export default writeFigures