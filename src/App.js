// import datasets from './datsets.csv'
import { useEffect, useState } from 'react'
import getData from './helper/getData'

function App() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const d = await getData()
      setData(d)
    };

    fetchData();
  }, []);
  return (
    <header className="App-header">
      <p>
        Edit <code>{data}</code> and save to reload.
        </p>
    </header>
  );
}

export default App;