import {csvParse} from 'd3'
import { DateTime } from 'luxon'
import { canUseDOM } from 'exenv'

const getDatasets = async () => await fetch(`${process.env.PUBLIC_URL}/datasets.csv`).then(s => s.text()).then(s => csvParse(s))
const insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

const toApiUrl = (url) => {
    const root = 'https://open.barnet.gov.uk/'
    return insertAt(url, 'api/', root.length)
}

const corsUrl = 'http://cors-anywhere.herokuapp.com/'
const headers = {
    Origin: process.env.PUBLIC_URL
}
const opts = { headers }
const fetchCors = async url => await fetch(canUseDOM ? corsUrl + url : url, opts)

async function getData() {
    const datasets = await getDatasets()
    const data = []
    for (const ds of datasets) {
        const { url, title } = ds
        const res = await fetchCors(toApiUrl(url))
        const d = await res.json()
        const resources = d.resources
        const keys = []
        const dates = []
        for (const k of Object.keys(resources)) {
            const dset = resources[k]
            const dt = DateTime.fromISO(dset['qa']['timestamp'].slice(0, 'yyyy-mm-dd'.length))
            dates.push(dt)
            keys.push(k)
        }
        const key = keys[dates.indexOf(DateTime.max(...dates))]
        const resourceUri = resources[key]['url']
        const csv = await fetchCors(resourceUri).then(s => s.text()).then(s => csvParse(s))
        // data.push(json)
        ds.data = csv
        data.push(ds)
    }
    return data
}

export default getData
// const datasetsCsv = csvParse(datasets).then(res => console.log(re