import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import { makeId } from '../functions/helper'
import Scrollspy from 'react-scrollspy'

const useStyles = makeStyles(theme => {
  return {
    root: {
      position: 'fixed',
      paddingLeft: theme.spacing(1),
      marginTop: theme.spacing(3)
    },
    link: {
      color: theme.palette.text.primary,
      '&:hover': {
        color: theme.palette.text.secondary,
        borderLeft: `1px solid ${theme.palette.secondary.main}`
      }
    },
    active: {
      borderLeft: `2px solid ${theme.palette.secondary.main}`
    }
  }
});

function ListItemLink(props) {
  return (
    <Hidden smDown>
      <ListItem component="a" display='hidden' {...props} />
    </Hidden>
  );
}

function SideNav({ titles }) {
  const classes = useStyles()
  const ids = titles.map(o => makeId(o))
  return (
    <Scrollspy items={ids} currentClassName={classes.active} className={classes.root}>
      {titles.map((title, i) => <ListItemLink key={ids[i]} className={classes.link} href={`#${ids[i]}`}><ListItemText primary={title}></ListItemText></ListItemLink>)}
    </Scrollspy >
  )
}

export default SideNav

