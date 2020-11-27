const path = require('path');
const fs = require('fs')
const getData = require('./src/functions/getDataServer')
const createCsvWriter = require('csv-writer').createObjectCsvWriter   

async function writeCsv(records, fn) {
  const headers = []
  Object.keys(records[0]).forEach(key => {
    headers.push({id: key, title: key})
  })
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, fn),
    header: headers
  });
  await csvWriter.writeRecords(records).then(() => console.log(`written to ${fn}`));
};

(async () => {
    const data = await getData()
    const dn = path.join('public','data')
    if(!fs.existsSync(dn)){
        fs.mkdirSync(dn)
    }
    for (const d of data){
        await writeCsv(d.data, path.join(dn, d.title + '.csv'))
    }
})()