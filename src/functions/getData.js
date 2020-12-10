import { csvParse } from 'd3'
import { DateTime } from 'luxon'

const getCsv = async url => await fetch(url).then(s => s.text()).then(s => csvParse(s))
const getDatasets = async () => await getCsv(`${process.env.PUBLIC_URL}/datasets.csv`)
const insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

const toApiUrl = (url) => {
    const root = 'https://open.barnet.gov.uk/'
    return insertAt(url, 'api/', root.length)
}

const corsUrl = 'https://cors-anywhere.herokuapp.com/'
const headers = {
    Origin: process.env.PUBLIC_URL
}
const opts = { headers }
const fetchCors = async url => await fetch(corsUrl + url, opts)

async function getResourceUri(url) {
    try {
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
        return resourceUri
    } catch (e) {
        console.log(e)
        return undefined
    }
}

async function getDataProd() {
    const datasets = await getDatasets()
    const data = []
    for (const ds of datasets) {
        const { url } = ds
        const resourceUri = await getResourceUri(url)
        try {
            const csvRes = await fetchCors(resourceUri)
            const csv = await csvRes.text().then(s => csvParse(s))
            ds.data = csv
            data.push(ds)
        } catch (e) {
            console.log(e)
            data.push(undefined)
            continue
        }
    }
    return data
}

async function getDataDev() {
    const datasets = await getDatasets()
    const data = []
    for (const ds of datasets) {
        const { title } = ds
        const csv = await getCsv(`${process.env.PUBLIC_URL}/data/${title}.csv`)
        ds.data = csv
        data.push(ds)
    }
    return data
}

async function getData(isDev) {
    return isDev ? await getDataDev() : await getDataProd()
}

export default getData