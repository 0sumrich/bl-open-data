import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Loadable from 'react-loadable'
// import Plot from 'react-plotly.js'


const useStyles = makeStyles(theme => ({
    root: {
        margin: `${theme.spacing(2)}px auto`,
    },
    cardHelper: {
        padding: theme.spacing(3)
    }
}));

// const LoadablePlot = Loadable({
//     loader: () => import('react-plotly.js'),
//     loading() {
//         return null
//     }
// });

function ChartWrapper({ children }) {
    const classes = useStyles()
    return (
        <Card className={classes.root}>
            <CardContent className={classes.cardHelper}>
                {children}
            </CardContent>
        </Card>
    );
}

export default ChartWrapper