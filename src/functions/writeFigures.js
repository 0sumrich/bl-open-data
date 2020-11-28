import loansByTypeFigure from './loansByTypeDraw'

function writeFigures(data) {
    if (data.length < 1) {
        return []
    }
    
    return [
        loansByTypeFigure(getDataByTitle('Library loans'))
    ]
}
export default writeFigures