import { useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '450px',
    }
}));

const Svg = ({ data, id, draw }) => {
	useEffect(() => {
		draw(data)
    })
    const classes = useStyles()
	return <svg id={id} className={classes.root}/>
}

export default Svg