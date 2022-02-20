const projectName = "bar-chart";

var w = 800,
	h = 400,
	barWidth = w / 275,
	padding = 0,
	svg,
	dataset;

document.addEventListener("DOMContentLoaded", function () {
	fetch(
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
	)
		.then((response) => response.json())
		.then((data) => {
			dataset = data.data;
			initD3();
		});
});

function initD3() {
	svg = d3.select(".chart").append("svg").attr("width", w).attr("height", h);

	const xScale = d3.scaleLinear().domain([0, dataset.length]).range([0, w]);

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(dataset, (d) => d[1])])
		.range([0, h]);

	dataset.forEach((ele) =>
		console.log(
			ele,
			yScale(ele[1]),
			d3.max(dataset, (d) => d[1])
		)
	);

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	svg
		.append("g")
		.attr("id", "x-axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	svg
		.append("g")
		.attr("id", "y-axis")
		.attr("transform", "translate(" + padding + ", 0)")
		.call(yAxis);

	svg
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("x", (d, i) => i * 3)
		.attr("y", (d, i) => h - yScale(d[1]))
		.attr("width", 2)
		.attr("height", (d, i) => yScale(d[1]))
		.attr("fill", "navy")
		.attr("class", "bar")
		.attr("data-date", (d) => d[0])
		.attr("data-gdp", (d) => d[1])
		.append("title")
		.attr("id", "tooltip")
		.text((d) => d[0]);
}
