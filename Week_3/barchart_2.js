// # Toon van Holthe tot Echten
// # 10798595
// script to create bar chart using d3

// Source: http://bl.ocks.org/d3noob/8952219
// create canvas
var margin = {top: 50, right: 30, bottom: 80, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// scale x
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// scale y
var y = d3.scale.linear()
  .range([height, 0]);

// create x-axes
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// create y-axes
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

// Define the div for the tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Precipitation:</strong> <span style='color:red'>" + d.neer + "</span>";
  })

// create bar chart
var chart = d3.select(".chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  chart.call(tip);

// load data
d3.json("/json_data_1.json", function(error, data) {
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.neer; })]);

// add elements to bar chart
chart.append("g")
 .attr("class", "x axis")
 .attr("transform", "translate(0," + height + ")")
 .call(xAxis)
 .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
          return "rotate(-65)"
        });

chart.append("g")
 .attr("class", "y axis")
   .call(yAxis)
  .append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 6)
   .attr("dy", ".71em")
   .style("text-anchor", "end")
   .text('Precipitation');

chart.selectAll(".bar")
 .data(data)
.enter().append("rect")
 .attr("class", "bar")
 .attr("x", function(d) { return x(d.date); })
 .attr("y", function(d) { return y(d.neer); })
 .attr("height", function(d) { return height - y(d.neer); })
 .attr("width", x.rangeBand())
 .on('mouseover', tip.show)
 .on('mouseout', tip.hide);

});

function type(d) {
  d.neer = +d.neer; // coerce to number
  return d;
}
