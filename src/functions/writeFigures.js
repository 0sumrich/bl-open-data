import loansByTypeFigure from './loansByTypeFigure'

function writeFigures(data) {
    if (data.length < 1) {
        return []
    }
    const getDataByTitle = title => data[data.map(o => o.title).indexOf(title)]
    return [
        loansByTypeFigure(getDataByTitle('Library loans'))
    ]
}
export default writeFigures