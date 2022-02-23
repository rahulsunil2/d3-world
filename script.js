const projectName = "bar-chart";

var w = 800,
	h = 400,
	barWidth = 2,
	padding = 60,
	svg,
	dataset;

document.addEventListener("DOMContentLoaded", function () {
	fetch(
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
	)
		.then((response) => response.json())
		.then((data) => {
			dataset = data.data;
			barWidth = (w - 2 * padding) / dataset.length;

			initD3();
		});
});

function initD3() {
	svg = d3.select(".chart").append("svg").attr("width", w).attr("height", h);

	const xScale = d3
		.scaleTime()
		.domain([
			d3.min(dataset, (d) => new Date(d[0])),
			d3.max(dataset, (d) => new Date(d[0])),
		])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleLinear()
		.domain([d3.max(dataset, (d) => d[1]), 0])
		.range([padding, h - padding]);

	// console.log(
	// 	d3.max(dataset, (d) => d[1]),
	// 	yScale(0),
	// 	xScale(0)
	// );
	console.log(
		d3.min(dataset, (d) => new Date(d[0])),
		d3.max(dataset, (d) => new Date(d[0])),
		d3.min(dataset, (d) => d[0]),
		xScale(new Date(d3.min(dataset, (d) => d[0])))
	);

	const xAxis = d3.axisBottom(xScale).ticks(10);
	const yAxis = d3.axisLeft(yScale).ticks(10);

	const toolTip = d3
		.select(".chart")
		.append("div")
		.attr("id", "tooltip")
		.attr("style", "visibility: hidden;");

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
		.attr("x", (d, i) => padding + i * barWidth)
		.attr("width", barWidth)
		.attr("y", (d, i) => yScale(d[1]))
		.attr("height", (d, i) => h - padding - yScale(d[1]))
		// .attr("fake", (d, i) => console.log(d[1], yScale(d[1]), h - yScale(d[1])))
		.attr("fill", "navy")
		.attr("class", "bar")
		.attr("data-date", (d) => d[0])
		.attr("data-gdp", (d) => d[1])
		.on("mouseover", function (e, d) {
			var posX = e.pageX - 250;
			var posY = e.pageY - 300;
			toolTip
				.attr(
					"style",
					"left:" + posX + "px;top:" + posY + "px; visibility: visible;"
				)
				.attr("data-date", d[0])
				.html("<strong>" + d[1] + "</strong>");

			d3.select(this).style("fill", "#ff33ff");
		})
		.on("mouseout", function (d) {
			d3.select(this).style("fill", "navy");
			toolTip.attr("style", "visibility: hidden;");
		});
}
