// import Svg from './svg'
import { useEffect, useState, Children, forwardRef, useRef } from 'react'
import { groupData } from '../functions/loansByTypeDraw'
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
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
}));

// function groupData(initData) {
// 	const keys = ['Month', 'Type', 'Loans'];
// 	const data = keepKeys(initData.data, keys);
// 	return Array.from(
// 		rollup(
// 			data,
// 			d => sum(d.map(d => +d.Loans)),
// 			d => d.Type,
// 			d => d.Month
// 		),
// 		([Type, m]) => ({
// 			Type, data: Array.from(m, ([Month, Loans]) => ({ Month, Loans }))
// 		})
// 	);
// }

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

function LoansByItemType({ data, title }) {
    const id = 'svg-' + makeId(title)
    const [chartData, setChartData] = useState(dataDates(groupData(data)))
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(450)
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
    // const MyComponent = React.forwardRef(function MyComponent(props, ref) {
    //     //  Spread the props to the underlying DOM element.
    //     return <div {...props} ref={ref}>Bin</div>
    //   });
    const Path = forwardRef((props, ref) => <path {...props} ref={ref}></path>)

    //   // ...

    //   <Tooltip title="Delete">
    //     <MyComponent>
    //   </Tooltip>
    const lineData = useRef(null)
    return (
        <svg className={classes.root} id={id} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g style={{
                transform: `translate(${margin.left}px, ${margin.top}px)`
            }}>
                {/* lines */}
                {Children.toArray(
                    chartData.map(r =>
                        (<>
                            <Tooltip placement='top' title='Click to select data'>
                                <Path
                                    ref={lineData}
                                    stroke={c(r.Type)}
                                    strokeWidth={1.5}
                                    fill='none'
                                    d={line(r.data)}
                                />
                            </Tooltip>
                        </>)
                    )
                )}
            </g>
        </svg>
    )
}

export default LoansByItemType