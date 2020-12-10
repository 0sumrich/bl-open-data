import { rollup, sum } from 'd3-array';
import { keepKeys } from './helper';
import { endOfMonth } from '../functions/helper';

export function groupData(initData) {
	const keys = ['Month', 'Type', 'Loans'];
	const data = keepKeys(initData.data, keys);
	return Array.from(
		rollup(
			data,
			d => sum(d.map(d => +d.Loans)),
			d => d.Type,
			d => d.Month
		),
		([Type, m]) => ({
			Type, data: Array.from(m, ([Month, Loans]) => ({ Month, Loans }))
		})
	);
}

export function dataDates(d) {
    d.forEach(row => {
        row.data.forEach(r => {
            const month = r.Month;
            const jsDate = endOfMonth(month);
            r.Month = jsDate;
        });
    });
    return d;
}
export function getHeight(d) {
    const months = d.map(o => o.Month);
    if (d.length % 2 === 0) {
        return d[months.length / 2].Loans;
    } else {
        const idx = Math.floor(months.length / 2);
        return (d[idx].Loans + d[idx + 1].Loans) / 2;
    }
}