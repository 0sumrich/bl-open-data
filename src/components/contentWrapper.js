import { makeStyles } from '@material-ui/core/styles';
import makeId from '../helper/makeId'
import ChartWrapper from './chartWrapper';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        maxWidth: 1126,
        padding: theme.spacing(4)
    }
}));

function ContentWrapper({ figures }) {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            {figures.map(fig => <ChartWrapper key={makeId(fig.layout.title)} data={fig.data} layout={fig.layout} id={makeId(fig.layout.title)} />)}
        </div>
    )
}

export default ContentWrapper