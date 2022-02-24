const projectName = "scatter-plot";

var w = 800,
	h = 400,
	barWidth = 2,
	padding = 60,
	svg,
	dataset;

document.addEventListener("DOMContentLoaded", function () {
	fetch(
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
	)
		.then((response) => response.json())
		.then((data) => {
			dataset = data.map((d) => {
				d.Time = moment(d.Time, "mm:ss");
				d.Year = new Date(String(d.Year));
				return d;
			});
			barWidth = (w - 2 * padding) / dataset.length;
			initD3();
		});
});

function initD3() {
	svg = d3.select(".chart").append("svg").attr("width", w).attr("height", h);

	const xScale = d3
		.scaleTime()
		.domain([d3.min(dataset, (d) => d.Year), d3.max(dataset, (d) => d.Year)])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleTime()
		.domain([d3.min(dataset, (d) => d.Time), d3.max(dataset, (d) => d.Time)])
		.range([padding, h - padding]);

	const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat("%Y"));
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	const yAxis = d3
		.axisLeft(yScale)
		.ticks(10)
		.tickFormat(d3.timeFormat("%M:%S"));

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
		.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("data-xvalue", (d) => d.Year)
		.attr("data-yvalue", (d) => d.Time, "mm:ss")
		.attr("cx", (d) => xScale(d.Year))
		.attr("cy", (d) => yScale(d.Time))
		.attr("r", 5)
		// .attr("fake", (d, i) => console.log(i, d))
		.attr("fill", (d) => color(!d.Doping.length))
		.on("mouseover", function (e, d) {
			var posX = e.pageX - 250;
			var posY = e.pageY - 300;
			toolTip
				.attr(
					"style",
					"left:" + posX + "px;top:" + posY + "px; visibility: visible;"
				)
				.attr("data-year", d.Year)
				.html("<strong>" + d.Year + "</strong>");

			d3.select(this).style("fill", "#ff33ff");
		})
		.on("mouseout", function (d) {
			d3.select(this).style("fill", "navy");
			toolTip.attr("style", "visibility: hidden;");
		});

	console.log(color.domain(), color.range());
	const legend = svg
		.append("g")
		.attr("id", "legend")
		.selectAll("#legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend-label")
		.attr("transform", function (d, i) {
			return "translate(0," + (h / 2 - i * 20) + ")";
		});

	legend
		.append("rect")
		.attr("x", w - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend
		.append("text")
		.attr("x", w - 20)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function (d) {
			if (d) {
				return "Riders with doping allegations";
			} else {
				return "No doping allegations";
			}
		});
}
