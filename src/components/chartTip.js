import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
    return {
        tooltip: {
            display: 'inline',
            marginLeft: props => theme.spacing(3) + props.margin.left,
            marginTop: props => theme.spacing(3) + props.margin.top,
            position: 'absolute',
            left: props => props.left ? props.left : 'auto',
            top: props => props.top,
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

function ChartTip(props) {
    const classes = useStyles(props)
    return <div className={classes.tooltip}>{props.children}</div>
}

export default ChartTip