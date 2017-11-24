// Toon van Holthe tot Echten
// 10798595
// script to create scatterplot using d3
window.onload = function(){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      radius = 3.5;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var t = d3.scale.linear()
      .range([1, 10]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("DATA.json", function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.CO2_emi; })).nice();
    y.domain(d3.extent(data, function(d) { return d.cereal; })).nice();
    t.domain(d3.extent(data, function(d) { return d.agri; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("CO2 emission (metric tons per capita)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("cereal yield (kg per hectare)")

    // title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("CO2 emission versus cereal yield per country");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 40))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Size indicates Agricultural land (% of land area)");

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return t(d.agri); })
        .attr("cx", function(d) { return x(d.CO2_emi); })
        .attr("cy", function(d) { return y(d.cereal); })
        .style("fill", function(d) { return color(d.class); })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
       .attr("x", width - 18)
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", color);

    legend.append("text")
       .attr("x", width - 24)
       .attr("y", 9)
       .attr("dy", ".35em")
       .style("text-anchor", "end")
       .text(function(d) { return d; });


    // Create Event Handlers for mouse
    // Source: http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
    function handleMouseOver(d, i) {  // Add interactivity
          svg.append("text").attr({

             id: 'current',  // Create an id for text so we can select it later for removing on mouseout
              x: function() { return x(d.CO2_emi) - 30; },
              y: function() { return y(d.cereal) - 15; }
          })
          .text(function() {
            return ['CO2: '+ Math.round(d.CO2_emi), 'Cereal yield: '+ Math.round(d.cereal), d.Country];  // Value of the text
          });
        }

    function handleMouseOut(d, i) {
          // Select text by id and then remove
            d3.select('#current').remove();  // Remove text location
        }

  });
}
