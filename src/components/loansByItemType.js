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
import {axisLeft, axisBottom} from 'd3-axis'
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
    }
}));

// scale example

// export default function App() {
//     const xScale = scaleLinear()
//       .domain([0, 1])
//       .range([10, 300]);
//     const yScale = scaleLinear()
//       .domain([0, 1])
//       .range([10, 150]);
//     const [xStart, xEnd] = xScale.range();
//     const [yStart, yEnd] = yScale.range();
//     const ticks = xScale.ticks();
  
//     return (
//       <div className="App">
//         <svg width={1000} height={1000}>
//           <line x1={xStart} x2={xEnd} y1={yEnd} y2={yEnd} stroke="red" />
//           <line x1={xStart} x2={xStart} y1={yEnd} y2={yStart} stroke="red" />
//           <g className="ticks">
//             {ticks.map((t, i) => {
//               const x = xScale(t);
//               return (
//                 <React.Fragment key={i}>
//                   <line x1={x} x2={x} y1={yEnd} y2={yEnd + 5} stroke="red" />
//                   <text
//                     x={x}
//                     y={yEnd + 20}
//                     fill="red"
//                     textAnchor="middle"
//                     fontSize={10}
//                   >
//                     {t}
//                   </text>
//                 </React.Fragment>
//               );
//             })}
//           </g>
//         </svg>
//       </div>
//     );
//   }


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
    const [xStart, xEnd] = x.range();
    const [yStart, yEnd] = y.range();
    const ticks = x.ticks();
    return (
        <>
            <svg className={classes.root} id={id} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                <g style={{
                    transform: `translate(${margin.left}px, ${margin.top}px)`
                }}>
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
                                <g>
                                    {Children.toArray(ticks.map((t,i) =>{
                                        const xPos = x(t)
                                        return (
                                            <>
                                                <line x1={xPos} x2={xPos} y1={yEnd} y2={yEnd + 5} stroke="black" />
                                                <text>{DateTime.fromJSDate(t).toFormat('MMM y')}</text>
                                            </>
                                        )
                                    }))}
                                </g>
                            </>)
                        )
                    )}
                </g>
            </svg>
            <ChartTip margin={margin} x={"-50%"} y={"-50%"} top={lineTipY - 25} left={width / 2} visible={lineTipVisible}>
                <Typography variant='caption'>
                    {lineTipText}
                </Typography>
            </ChartTip>
            <ChartTip margin={margin} x={"-50%"} y={"-50%"} left={circleTipPos[0]} top={circleTipPos[1] - 45} visible={circleTipVisible}>
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