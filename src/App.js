import { useEffect, useState, Children } from 'react'
import Grid from '@material-ui/core/Grid'
import Header from "./components/header"
import SideNav from './components/sideNav'
import ContentWrapper from './components/contentWrapper'
import ChartWrapper from './components/chartWrapper'
import Loans from './components/loans'
import getData from './functions/getData'
import { getDataByTitle, makeId } from './functions/helper'
import {groupDataByItemType, groupDataByLibrary} from './functions/loansHelp'

const isDev = process.env.NODE_ENV === 'development'
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
  
  const charts = [
    {
      title: 'Loans by item type',
      component: (props) => <Loans {...props} data={groupDataByItemType(getDataByTitle(data, 'Library loans'))} />
    },
    {
      title: 'Loans by library',
      component: (props) => <Loans {...props} data={groupDataByLibrary(getDataByTitle(data, 'Library loans'))} />
    }
  ]
  return (
    <Grid container>
      <Side><SideNav titles={charts.map(o => o.title)} /></Side>
      <Main>
        <Header siteTitle='Barnet Libraries' subTitle='Open data' />
        <ContentWrapper>
          {
            Children.toArray(
              charts.map(({ title, component }, i) => (
                <section id={makeId(title)}>
                  <ChartWrapper>
                    {data.length > 0 ? component({ title }) : null}
                  </ChartWrapper>
                </section>
              )
              )
            )
          }
        </ContentWrapper>
      </Main>
    </Grid>
  )
}

export default App;