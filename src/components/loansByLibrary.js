import { useEffect, useState, Children } from 'react'
import classNames from 'classnames';
import { groupDataByLibrary, dataDates, getHeight } from '../functions/loansHelp'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ChartTip from './chartTip'
import { makeId, minMax } from '../functions/helper';
import { select } from 'd3-selection'
import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
import { min, max } from 'd3-array'
import { line } from 'd3-shape'
import { schemeTableau10 } from 'd3-scale-chromatic'
import { axisLeft, axisBottom } from 'd3-axis'
import { DateTime } from 'luxon'
import XAxis from './xAxis'
import YAxis from './yAxis'
import Title from './title'

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
    selected: {
        strokeWidth: 3
    },
    circle: {
        cursor: 'pointer'
    },
    legend: {
        fill: 'none',
        fontSize: 10,
    },
    legendText: {
        fontSize: '0.6rem',
        stroke: 'none',
        textAnchor: 'end',
    }
}));


function LoansByLibrary({ data, title }) {
    const id = 'svg-' + makeId(title)
    const chartData = dataDates(groupDataByLibrary(data))
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(450)
    const [lineTipY, setLineTipY] = useState(height / 2)
    const [lineTipVisible, setLineTipVisible] = useState(false)
    const [lineTipText, setLineTipText] = useState("")
    const [circleTipPos, setCircleTipPos] = useState([width / 2, height / 2])
    const [circleTipVisible, setCircleTipVisible] = useState(false)
    const [circleTipText, setCircleTipText] = useState({ type: '', month: '', loans: '' })
    const [selected, setSelected] = useState([])
    const margin = { top: 65, right: 10, bottom: 30, left: 75 };
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
    const c = d3.scaleOrdinal().domain(chartData.map(o => o.library)).range(d3.schemeTableau10)

    return (
        <>
            <svg onDoubleClick={() => setSelected([])} className={classes.root} id={id} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                <Title x={margin.left + width / 2} y={0.25 * margin.top}>{'Monthly ' + title}</Title>
                <g style={{
                    transform: `translate(${margin.left}px, ${margin.top}px)`
                }}>
                    <g>
                        {Children.toArray(
                            chartData.map(r =>
                                (<>
                                    <path
                                        className={classNames(classes.line, { [classes.selected]: selected.includes(r.library) })}
                                        stroke={c(r.library)}
                                        d={line(r.data)}
                                        onMouseEnter={() => {
                                            setLineTipY(y(getHeight(r.data)))
                                            setLineTipVisible(true)
                                            setLineTipText(r.library)
                                        }}
                                        onMouseLeave={() => {
                                            setLineTipVisible(false)
                                        }}
                                        onClick={() => {
                                            // let arr = selected
                                            if (!selected.includes(r.library)) {
                                                setSelected([...selected, r.library])
                                            } else {
                                                setSelected(selected.filter(x => x !== r.library))
                                            }

                                        }}
                                        strokeOpacity={selected.includes(r.library) || selected.length < 1 ? 1 : 0.2}
                                    />
                                    <g>
                                        {Children.toArray(
                                            r.data.map(d => (
                                                <circle
                                                    className={classes.circle}
                                                    r={1.5}
                                                    cx={x(d.Month)}
                                                    cy={y(d.Loans)}
                                                    fill={c(r.library)}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.setAttribute('r', 3)
                                                        setCircleTipPos([x(d.Month), y(r.library)])
                                                        setCircleTipVisible(true)
                                                        setCircleTipText({
                                                            type: r.library,
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
                        <g className={classes.legend} transform={`translate(${width}, 0)`}>
                            {Children.toArray(selected.map((t, i) =>
                                <text className={classes.legendText} y={15 * (i)} fill={c(t)}>{t}</text>
                            ))}
                        </g>
                    </g>
                    <XAxis height={height} width={width} tickArray={months} tickFunction={t => DateTime.fromJSDate(t).toFormat('MMM yy')} scale={x} />
                    <YAxis height={height} width={width} tickArray={y.ticks()} scale={y} />
                    <text transform="rotate(-90)" x={height/-2} y={-margin.left} dy={'1rem'} style={{textAnchor: 'middle'}}>Loans + renewals</text>
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

export default LoansByLibrary