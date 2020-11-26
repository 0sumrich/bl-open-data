const { csvParse } = require('d3')
const { DateTime } = require('luxon')
const fetch = require('isomorphic-unfetch')
const fs = require('fs')
const path = require('path')


const getDatasets = () => {
    const file = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'datasets.csv'))
    return csvParse(file.toString())
}
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
const fetchCors = async url => await fetch(url, opts)

module.exports = async function getData() {
    const datasets = getDatasets()
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