import { csvParse } from 'd3'
// import datasets from '../datasets.csv'

const getDatasets = async () => await fetch(`${process.env.PUBLIC_URL}/datasets.csv`).then(s => s.text()).then(s => csvParse(s))

async function getData() {
    const datasets = await getDatasets() 
    debugger;
    return 'test'
}

export default getData
// const datasetsCsv = csvParse(datasets).then(res => console.log(res))