import { useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { rollup, sum } from 'd3-array';
import { keepKeys, unpack } from './helper';
import { select } from 'd3-selection'
import { scaleLinear, scaleTime, scaleOrdinal } from 'd3-scale'
import { min, max } from 'd3-array'
import { line } from 'd3-shape'
// d3.schemeTableau10
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
    }
}));

const Svg = ({ data, id, draw, title }) => {
    useEffect(() => {
        draw(data, id, title)
    })
    const classes = useStyles()
    return <svg id={id} className={classes.root} />
}

export default Svg