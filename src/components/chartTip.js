import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
    return {
        tooltip: {
            position: 'absolute',
            left: props => props.x,
            top: props => props.y,
            transform: "translate(-50%, -50%)",
            visibility: props => props.visible ? 'visible' : 'hidden',
            background: theme.palette.grey[900],
            opacity: 0.5,
            color: theme.palette.primary.contrastText,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1)
        }
    }
})

function ChartTip({ x, y, visible, children }) {
    const classes = useStyles({ x, y, visible })
    return <div className={classes.tooltip}>{children}</div>
}

export default ChartTip