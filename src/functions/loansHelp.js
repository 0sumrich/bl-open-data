import { rollup, sum } from 'd3-array';
import { keepKeys } from './helper';
import { jsDate } from './helper';

function dataDates(d) {
	d.forEach(row => {
		row.data.forEach(r => {
			const month = r.Month;
			const dt = jsDate(month);
			r.Month = dt;
		});
	});
	return d;
}

function groupData(initData, keys) {
	const dataKey = keys[0]
	const data = keepKeys(initData.data, keys)
	return Array.from(
		rollup(
			data,
			d => sum(d.map(d => +d.Loans)),
			d => d[dataKey],
			d => d.Month
		),
		([dk, m]) => ({
			[dataKey]: dk, data: Array.from(m, ([Month, Loans]) => ({ Month, Loans }))
		})
	)
}

export function groupDataByItemType(initData) {
	const keys = ['Type', 'Month', 'Loans'];
	return dataDates(groupData(initData, keys))
}

export function groupDataByLibrary(initData) {
	const keys = ['Library name', 'Month', 'Loans'];
	return dataDates(groupData(initData, keys))
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