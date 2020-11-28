import { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Header from "./components/header"
import SideNav from './components/sideNav'
import ContentWrapper from './components/contentWrapper'
import ChartWrapper from './components/chartWrapper'
import LoansByItemType from './components/loansByItemType'
import getData from './functions/getData'
import { getDataByTitle, makeId } from './functions/helper'

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
  // const figures = writeFigures(data)
  const charts = [
    {
      title: 'Loans by item type',
      component: (props) => <LoansByItemType {...props} data={getDataByTitle(data, 'Library loans')} />
    }
  ]
  return (
    <Grid container>
      <Side><SideNav titles={charts.map(o => o.title)} /></Side>
      <Main>
        <Header siteTitle='Barnet Libraries' subTitle='Open data' />
        <ContentWrapper>
          {
            charts.map(({ title, component }, i) => (
              <ChartWrapper key={`chart${i}`}>
                <section id={makeId(title)}>
                  {data.length > 0 ? component({ title }) : null}
                </section>
              </ChartWrapper>
            )
            )
          }
        </ContentWrapper>
      </Main>
    </Grid>
  )
}

export default App;