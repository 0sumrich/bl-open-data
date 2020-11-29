import { rollup, sum } from 'd3-array';
import { keepKeys, unpack } from './helper';
import { select } from 'd3-selection'

function groupData(initData) {
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

function draw(data, id) {
	// data.Type data.data > data.data[0] = Month, and Loans
	const svg = select(id)
}

/*

import * as d3 from "d3";
import tip from "./tip";
import sortData from './sortData';

export default function ages(data) {
	const margin = { top: 30, right: 50, bottom: 60, left: 70 };
	const width = 950 - margin.left - margin.right;
	const height = 600 - margin.top - margin.bottom;
	const x = d3.scaleLinear().range([0, width]);
	const y = d3.scaleLinear().range([0, height]);

	const chart = d3
		.select("#ages")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	chart.call(tip);

	const d = data.filter(o => +o.age < 99);
	const xDomainMax = d3.max(d.map(o => +o.age));
	x.domain([0, 99]);

	const yDomainMax = d3.max([
		...d.map(o => +o.activeCount),
		...d.map(o => +o.expiredCount)
	]);

	y.domain([yDomainMax, 0]);

	const expiredLine = d3
		.line()
		.x(d => x(d.age))
		.y(d => y(d.expiredCount));

	const activeLine = d3
		.line()
		.x(d => x(d.age))
		.y(d => y(d.activeCount));

	expiredLine(d);

	activeLine(d);

	const newData = [...sortData(d, "expired"), ...sortData(d, "active")];

	const line = d3
		.line()
		.x(d => d.age)
		.y(d => d.count);

	line(newData);

	chart
		.selectAll(".circle")
		.data(newData)
		.enter()
		.append("circle")
		.attr("class", "circle")
		.attr("cx", d => x(d.age))
		.attr("cy", d => y(d.count))
		.attr("r", 4)
		.attr("fill", d => (d.type == "active" ? "blue" : "red"))
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	chart
		.append("path")
		.datum(d)
		.attr("class", "expiredLine")
		.attr("d", expiredLine);

	chart
		.append("path")
		.datum(d)
		.attr("class", "activeLine")
		.attr("d", activeLine);

	//axes
	const xAxis = d3.axisBottom(x);
	const yAxis = d3.axisLeft(y);

	chart
		.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxis);

	chart
		.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	chart
		.append("text")
		.attr("class", "legend")
		.attr(
			"transform",
			`translate(${width / 2}, ${height + margin.bottom / 2})`
		)
		.attr("alignment-baseline", "middle")
		.style("text-anchor", "middle")
		.text("Age in Years");

	chart
		.append("text")
		.attr("class", "legend")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - 0.75 * margin.left)
		.attr("x", 0 - height / 2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Number of Customers");

	//legend
	const legX = 200;
	const legY = 0;
	const legYSpacing = 15;

	chart
		.append("circle")
		.attr("cx", width - legX)
		.attr("cy", legY)
		.attr("r", 4)
		.attr("fill", "blue");

	chart
		.append("circle")
		.attr("cx", width - legX)
		.attr("cy", legYSpacing)
		.attr("r", 4)
		.attr("fill", "red");

	chart
		.append("text")
		.attr("class", "legend")
		.attr("transform", `translate(${width - legX + 10}, ${legY})`)
		.attr("alignment-baseline", "middle")
		.text("Active Customers");

	chart
		.append("text")
		.attr("class", "legend")
		.attr("transform", `translate(${width - legX + 10}, ${legYSpacing})`)
		.attr("alignment-baseline", "middle")
		.text("Lapsed Customers");
}
*/

export {
	groupData, draw
}