import Svg from './svg'
import {useState} from 'react'
import {groupData, draw} from '../functions/loansByTypeDraw'

function LoansByItemType({ data }) {
    return <Svg data={groupData(data)} draw={draw} id='svg-loans-by-item-type' />
}

export default LoansByItemType