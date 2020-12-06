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

const XAxis = ({ height, width, tickArray, scale, tickFunction }) => {
    const classes = useStyles()
    const x = scale
    return (
        <g className={classes.xAxis} transform={`translate(0, ${height})`}>
            <line x1={0} x2={width} stroke='black' />
            {Children.toArray(tickArray.map(t => (
                <>
                    <g transform={`translate(${x(t)}, 0)`}>
                        <line y2="6" stroke='currentColor' />
                        <text className={classes.tickTextX} y="9" dy="0.71em">{tickFunction ? tickFunction(t) : t}</text>
                    </g>
                </>
            )
            ))
            }
        </g>
    )
}

export default XAxis