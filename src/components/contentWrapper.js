import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        maxWidth: 1126,
        padding: theme.spacing(4)
    }
}));

function ContentWrapper({ children }) {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            {children}
        </div>
    )
}

export default ContentWrapper