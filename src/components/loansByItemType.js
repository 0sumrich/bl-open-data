// import Svg from './svg'
import { useEffect, useState, Children, forwardRef, useRef } from 'react'
import { groupData } from '../functions/loansByTypeDraw'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
// import Tooltip from '@material-ui/core/Tooltip';
import ChartTip from './chartTip'
import { makeId } from '../functions/helper';
import { select, selectAll } from 'd3-selection'
import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
import { min, max } from 'd3-array'
import { line } from 'd3-shape'
import { schemeTableau10 } from 'd3-scale-chromatic'
import { DateTime } from 'luxon'
const d3 = {
    select,
    scaleLinear,
    scaleOrdinal,
    scaleTime,
    min,
    max,
    line,
    schemeTableau10
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '450px',
    },
    line: {
        strokeWidth: 1.5,
        fill: 'none',
        cursor: 'pointer',
        '&:hover': {
            strokeWidth: 2.5
        }
    },
}));

function endOfMonth(monthString) {
    return DateTime.fromISO(monthString).plus({ months: 1, days: - 1 }).toJSDate()
}

function dataDates(d) {
    d.forEach(row => {
        row.data.forEach(r => {
            const month = r.Month
            const jsDate = endOfMonth(month)
            r.Month = jsDate
        })
    })
    return d
}

const minMax = arr => [min(arr), max(arr)]

function getHeight(d) {
    const months = d.map(o => o.Month)
    if (d.length % 2 === 0) {
        return d[months.length / 2].Loans
    } else {
        const idx = Math.floor(months.length / 2)
        return (d[idx].Loans + d[idx + 1].Loans) / 2
    }
}

function LoansByItemType({ data, title }) {
    const id = 'svg-' + makeId(title)
    const [chartData, setChartData] = useState(dataDates(groupData(data)))
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(450)
    const [lineTipY, setLineTipY] = useState(height / 2)
    const [lineTipVisible, setLineTipVisible] = useState(false)
    const [lineTipText, setLineTipText] = useState("")
    const margin = { top: 30, right: 50, bottom: 60, left: 70 };
    const classes = useStyles()
    useEffect(() => {
        const svg = d3.select(`#${id}`)
        setWidth(parseInt(svg.style('width')) - margin.left - margin.right)
        setHeight(parseInt(svg.style('height')) - margin.top - margin.bottom)
    })
    const months = chartData.map(o => o.data.map(x => x.Month))[0]
    const loans = chartData.map(o => o.data.map(x => x.Loans)).flat()
    const x = d3.scaleTime()
        .domain(minMax(months))
        .range([0, width])
    const y = d3.scaleLinear()
        .domain(minMax(loans))
        .range([height, 0])
    const line = d3.line()
        .x(d => x(d.Month))
        .y(d => y(d.Loans))
    const c = d3.scaleOrdinal().domain(chartData.map(o => o.Type)).range(d3.schemeTableau10)

    return (
        <>
            <svg className={classes.root} id={id} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                <g style={{
                    transform: `translate(${margin.left}px, ${margin.top}px)`
                }}>
                    {/* lines */}
                    {Children.toArray(
                        chartData.map(r =>
                            (<>
                                <path
                                    className={classes.line}
                                    stroke={c(r.Type)}
                                    d={line(r.data)}
                                    onMouseEnter={() => {
                                        setLineTipY(`${y(getHeight(r.data))}px`)
                                        setLineTipVisible(true)
                                        setLineTipText(r.Type)
                                    }}
                                    onMouseLeave={() => {
                                        setLineTipVisible(false)
                                    }}
                                />
                            </>)
                        )
                    )}
                </g>
            </svg>
            <ChartTip x={"50%"} y={lineTipY} visible={lineTipVisible}>
                <Typography variant='caption'>
                    Click to select<br/>
                    {lineTipText}
                </Typography>
            </ChartTip>
        </>
    )
}

export default LoansByItemType