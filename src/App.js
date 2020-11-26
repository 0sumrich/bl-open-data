import { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Header from "./components/header"
import SideNav from './components/sideNav'
import ContentWrapper from './components/contentWrapper'
import writeFigures from './helper/writeFigures'
import getData from './helper/getData'

const isDev = process.env.NODE_ENV
// const isDev = false

const Side = ({ children }) => <Grid item md={2} sm={false} xs={false}>{children}</Grid>
const Main = ({ children }) => <Grid item md={10} sm={12} xs={12}>{children}</Grid>

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const d = await getData(isDev)
      setData(d)
    };

    fetchData();
  }, []);
  const figures = writeFigures(data)
  return (
    <Grid container>
      <Side><SideNav titles={figures.map(o => o.layout.title)} /></Side>
      <Main>
        <Header siteTitle='Barnet Libraries' subTitle='Open data' />
        <ContentWrapper figures={figures} />
      </Main>
    </Grid>
  )
}

export default App;