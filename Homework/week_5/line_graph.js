// Toon van Holthe tot Echten
// 10798595
// script to create line graph using d3

// STN = Plaats code
// FHX = Hoogste uurgemiddelde windsnelheid (in 0.1 m/s)
// TX = Maximum temperatuur (in 0.1 graden Celsius)
// UX = Maximale relatieve vochtigheid (in procenten);

window.onload = function(){

  // set the dimensions and margins of the graph
  var margin = {top: 40, right: 80, bottom: 40, left: 60},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y%m%d");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var valueline_TX = d3.line()
      .x(function(d) { return x(d.DATE); })
      .y(function(d) { return y(d.TX); });

  // define the line
  var valueline_FHX = d3.line()
      .x(function(d) { return x(d.DATE); })
      .y(function(d) { return y(d.FHX); });

  // define line
  var valueline_UX = d3.line()
      .x(function(d) { return x(d.DATE); })
      .y(function(d) { return y(d.UX); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  function draw(data) {

    data.forEach(function(d) {
        d.DATE = parseTime(d.DATE);
        d.TX = +d.TX;
        d.FHX = +d.FHX;
        d.UX = +d.UX
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.DATE; }));
    y.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.TX, d.FHX); })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .text('Max Temp')
        .attr("d", valueline_TX);

    svg.append("text")
        .attr("transform", "translate(" + (width+3) + "," + y(data[1].TX) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "red")
        .text("Max Temp");

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline_FHX);

    svg.append("text")
        .attr("transform", "translate(" + (width+3) + "," + y(data[2].FHX) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Wind Speed");

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style('stroke','green')
        .attr("d", valueline_UX);

    svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[3].UX) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "green")
		.text("Humidity");

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    }
  // Get the data
  d3.json("DATA_maas.json", function(error, data) {
    if (error) throw error;

    // trigger render
    draw(data, "STN");
  });



  // // ** Update data section (Called from the onclick)
  // function updateData() {
  //
  //   // Get the data again
  //   d3.json("DATA_schip.json", function(error, data) {
  //      	data.forEach(function(d) {
	//     	d.date = parseDate(d.date);
	//     	d.close = +d.close;
	//     });
  //
  //   	// Scale the range of the data again
  //   	x.domain(d3.extent(data, function(d) { return d.DATE; }));
	//     y.domain([0, d3.max(data, function(d){
  //     	  return Math.max(d.TX, d.FHX); })]);
  //
  //   // Select the section we want to apply our changes to
  //   var svg = d3.select("body").transition();
  //
  //       // Make the changes
  //       svg.select(".line")   // change the line
  //           .duration(750)
  //           .attr("d", valueline(data));
  //       svg.select(".x.axis") // change the x axis
  //           .duration(750)
  //           .call(xAxis);
  //       svg.select(".y.axis") // change the y axis
  //           .duration(750)
  //           .call(yAxis);
  //
  //   });
  // }

console.log(updateGraph);
}

function updateGraph(data) {


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.DATE; }));
    y.domain([d3.min(data, function(d) { return d.TX; }), d3.max(data, function(d) { return d.FHX; })]);


    // Nest the entries by state
    dataNest = d3.nest()
        .key(function(d) {return d.STN;})
        .entries(data);


    var result = dataNest.filter(function(val,idx, arr){
        return $("." + val.key).attr("fill") != "#ccc"
        // matching the data with selector status
    })


    var stad = svg.selectAll(".line")
        .data(result, function(d){return d.key});

    state.enter().append("path")
        .attr("class", "line");

    state.transition()
        .style("stroke", function(d,i) { return d.color = color(d.key); })
        .attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
        .attr("d", function(d){

    return stateline(d.values)
    });

}
