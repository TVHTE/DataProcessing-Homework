// # Toon van Holthe tot Echten
// # 10798595

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

// create bar chart
var chart = d3.select(".chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
   .call(yAxis);

chart.selectAll(".bar")
 .data(data)
.enter().append("rect")
 .attr("class", "bar")
 .attr("x", function(d) { return x(d.date); })
 .attr("y", function(d) { return y(d.neer); })
 .attr("height", function(d) { return height - y(d.neer); })
 .attr("width", x.rangeBand())
 .on("mouseover", handleMouseOver)
 .on("mouseout", handleMouseOut);


// Source : http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
// Create Event Handlers for mouse
    function handleMouseOver(d, i) {  // Add interactivity

          // Use D3 to select element, change color and size
          d3.select(this).style(
            'fill', "red"
          );

          // Specify where to put label of text
          chart.append("text").attr({
             id: "t" + d.date + "-" + d.neer + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
              x: function() { return x(d.date) - 30; },
              y: function() { return y(d.neer) - 5 ; }
          })
          .text(function() {
            return [d.date, d.neer];  // Value of the text
          });
        }

    function handleMouseOut(d, i) {
          // Use D3 to select element, change color back to normal
          d3.select(this).style(
            'fill', "yellow",
          );

          // Select text by id and then remove
          d3.select("#t" + d.date + "-" + d.neer + "-" + i).remove();  // Remove text location

   };
});

function type(d) {
  d.neer = +d.neer; // coerce to number
  return d;
}
