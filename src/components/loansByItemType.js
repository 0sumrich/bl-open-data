// import Svg from './svg'
import { useEffect, useState, Children } from 'react'
import { groupData } from '../functions/loansByTypeDraw'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
// import Tooltip from '@material-ui/core/Tooltip';
import ChartTip from './chartTip'
import { makeId, minMax, endOfMonth } from '../functions/helper';
import { select, selectAll } from 'd3-selection'
import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
import { min, max } from 'd3-array'
import { line } from 'd3-shape'
import { schemeTableau10 } from 'd3-scale-chromatic'
import { axisLeft, axisBottom } from 'd3-axis'
import { DateTime } from 'luxon'
const d3 = {
    select,
    scaleLinear,
    scaleOrdinal,
    scaleTime,
    min,
    max,
    line,
    schemeTableau10,
    axisLeft,
    axisBottom
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
            strokeWidth: 3
        }
    },
    circle: {
        cursor: 'pointer'
    },
    xAxis: {
        fill: 'none',
        fontSize: 10,
        fontFamily: 'inherit',
        textAnchor: 'midde'
    },
    tickText: {
        fontSize: '0.5rem',
        stroke: 'none',
        fill: 'black',
        textAnchor: 'middle',
        fontWeight: 'lighter'
    },
    ticks: {
    }
}));


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



function getHeight(d) {
    const months = d.map(o => o.Month)
    if (d.length % 2 === 0) {
        return d[months.length / 2].Loans
    } else {
        const idx = Math.floor(months.length / 2)
        return (d[idx].Loans + d[idx + 1].Loans) / 2
    }
}

function XAxis(scale, tickFunction, height, width) {
    const classes = useStyles()
    const ticks = scale.scale.ticks()
    // const [xStart, xEnd] = scale.scale.range()
    return (
        <g className={classes.xAxis} transform={`translate(0, ${height})`}>
            {Children.toArray(ticks.map(t => {
                const x = scale.scale(t)
                return (
                    <>
                        <g className={classes.tick} transform={`translate(${x}, 0)`}>
                            <line y2="6" stroke='currentColor' />
                            <text fill="currentColor" y="9" dy="0.71em">{tickFunction(t)}</text>
                        </g>
                    </>
                )
            }))
            }
        </g>
    )
}

function LoansByItemType({ data, title }) {
    const id = 'svg-' + makeId(title)
    const [chartData, setChartData] = useState(dataDates(groupData(data)))
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(450)
    const [lineTipY, setLineTipY] = useState(height / 2)
    const [lineTipVisible, setLineTipVisible] = useState(false)
    const [lineTipText, setLineTipText] = useState("")
    const [circleTipPos, setCircleTipPos] = useState([width / 2, height / 2])
    const [circleTipVisible, setCircleTipVisible] = useState(false)
    const [circleTipText, setCircleTipText] = useState({ type: '', month: '', loans: '' })
    const margin = { top: 30, right: 50, bottom: 60, left: 70 };
    const classes = useStyles()
    function tickFunction(t) {
        return DateTime.fromJSDate(t).toFormat('MMM, yy')
    }
    useEffect(() => {
        const svg = d3.select(`#${id}`)
        setWidth(parseInt(svg.style('width')) - margin.left - margin.right)
        setHeight(parseInt(svg.style('height')) - margin.top - margin.bottom)
    }, [margin, id])
    const months = chartData.map(o => o.data.map(x => x.Month))[0]
    const loans = chartData.map(o => o.data.map(x => x.Loans)).flat()
    const itemTypes = chartData.map(o => o.Type)
    const x = d3.scaleTime()
        .domain(minMax(months))
        .range([0, width])
    const y = d3.scaleLinear()
        .domain(minMax(loans))
        .range([height, 0])
    const line = d3.line()
        .x(d => x(d.Month))
        .y(d => y(d.Loans))
    // color scale
    const c = d3.scaleOrdinal().domain(chartData.map(o => o.Type)).range(d3.schemeTableau10)
    // const xAxis = d3.axisBottom(x);
    // const yAxis = d3.axisLeft(y);
    // const ticks = x.ticks();
    // const xTextArr = months.map(x => DateTime.fromJSDate(x).toFormat('MMM yy'))

    return (
        <>
            <svg className={classes.root} id={id} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                <g style={{
                    transform: `translate(${margin.left}px, ${margin.top}px)`
                }}>
                    <g>
                        {Children.toArray(
                            chartData.map(r =>
                                (<>
                                    <path
                                        className={classes.line}
                                        stroke={c(r.Type)}
                                        d={line(r.data)}
                                        onMouseEnter={() => {
                                            setLineTipY(y(getHeight(r.data)))
                                            setLineTipVisible(true)
                                            setLineTipText(r.Type)
                                        }}
                                        onMouseLeave={() => {
                                            setLineTipVisible(false)
                                        }}
                                    />
                                    <g>
                                        {Children.toArray(
                                            r.data.map(d => (
                                                <circle
                                                    className={classes.circle}
                                                    r={1.5}
                                                    cx={x(d.Month)}
                                                    cy={y(d.Loans)}
                                                    fill={c(r.Type)}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.setAttribute('r', 3)
                                                        setCircleTipPos([x(d.Month), y(d.Loans)])
                                                        setCircleTipVisible(true)
                                                        setCircleTipText({
                                                            type: r.Type,
                                                            month: d.Month,
                                                            loans: d.Loans
                                                        })
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.setAttribute('r', 1.5)
                                                        setCircleTipVisible(false)
                                                    }}
                                                />
                                            )
                                            ))}
                                    </g>
                                </>)
                            )
                        )}
                    </g>
                    {/* {axes} */}
                    <XAxis scale={x} tickFunction={tickFunction} height={height} />
                </g>
            </svg>
            <ChartTip margin={margin} top={lineTipY - 25} left={width / 2} visible={lineTipVisible}>
                <Typography variant='caption'>
                    {lineTipText}
                </Typography>
            </ChartTip>
            <ChartTip margin={margin} left={circleTipPos[0]} top={circleTipPos[1] - 45} visible={circleTipVisible}>
                <Typography variant='caption'>
                    {`${circleTipText.type}`}<br />
                    {`${DateTime.fromJSDate(circleTipText.month).toFormat('MMM y')}`}<br />
                    {`Loans: ${circleTipText.loans}`}
                </Typography>
            </ChartTip>
        </>
    )
}

export default LoansByItemType