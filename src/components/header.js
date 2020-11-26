import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'block',
    margin: 'auto',
    paddingTop: theme.spacing(3),
    textAlign: 'center'
  },
}));

const Header = ({ siteTitle, subTitle }) => {
  const classes = useStyles()
  return (
    <header className={classes.root}>
      <Typography variant='h2' component="h1" >
        {siteTitle}
      </Typography>
      <Typography variant='h4' component="h4" >
        {subTitle}
      </Typography>
    </header>
  )
}

export default Header