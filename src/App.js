// import datasets from './datsets.csv'
import { useEffect, useState } from 'react'
import getData from './helper/getData'


function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const d = await getData()
      // const d = await fetch('https://open.barnet.gov.uk/api/*')
      setData(d)
    };

    fetchData();
  }, []);
  return (
    <header className="App-header">
      <p>
        <code>{data.length>0 ? 'Loaded' : '....'}</code>
        </p>
    </header>
  );
}

export default App;