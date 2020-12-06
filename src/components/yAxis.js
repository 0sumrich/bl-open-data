import { Children } from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    xAxis: {
        fill: 'none',
        fontSize: 10,
        fontFamily: 'inherit'
    },
    tickTextX: {
        fontSize: '0.6rem',
        stroke: 'none',
        fill: 'currentColor',
        textAnchor: 'middle'
    },
    tickTextY: {
        fontSize: '0.6rem',
        stroke: 'none',
        fill: 'currentColor',
        textAnchor: 'end'
    }
}))

const YAxis = ({ height, tickArray, scale, tickFunction }) => {
    const classes = useStyles()
    const y = scale
    return (
        <g className={classes.yAxis} transform={`translate(0, 0)`}>
            <line y1={0} y2={height} stroke='black' />
            {Children.toArray(tickArray.map(t => (
                <g transform={`translate(0, ${y(t)})`}>
                    <line x2="-6" stroke='currentColor' />
                    <text className={classes.tickTextY} x="-10" dy="0.32em">{tickFunction ? tickFunction(t) : t}</text>
                </g>
            )
            ))}
        </g>
    )
}

export default YAxis