// source http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
window.onload = function(){

    function filterJSON(json, key, value) {
      var result = [];
      json.forEach(function(val,idx,arr){

          // console.log(value)
          // console.log(val[key])

        if(val[key] == value){

          result.push(val)
        }
      })
      return result;
    }

    // Set the dimensions of the canvas / graph
    var margin = {top: 50, right: 80, bottom: 100, left: 160},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // Parse the date / time
     var parseTime = d3.timeParse("%Y%m%d");

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define the line
    var stateline = d3.line()
        .x(function(d) { return x(d.DATE); })
        .y(function(d) { return y(d.VALUE); });

    // Adds the svg canvas
    var svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    var data;
    // Get the data
    d3.json("DATA_w5.json", function(error, json) {
      if (error) {
        return console.warn(error);
    }

      json.forEach(function(d) {
            d.DATE = +parseTime(d.DATE);
            d.VALUE = +d.VALUE;
      });
    	d3.select('#inds')
			.on("change", function () {
				var sect = document.getElementById("inds");
				var section = sect.options[sect.selectedIndex].value;

				data = filterJSON(json, 'TYPE', section);

	      //debugger

		    data.forEach(function(d) {
    			d.VALUE = +d.VALUE
    			d.active = true;
    		});

		    //debugger
				updateGraph(data);

				jQuery('h1.page-header').html(section);
			});


	// generate initial graph
	data = filterJSON(json, 'TYPE', 'TX');

	updateGraph(data);

});

var color = d3.scaleOrdinal().range(["#48A36D",  "#0096ff"]);

function updateGraph(data) {


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.DATE; }));
    y.domain([d3.min(data, function(d) { return d.VALUE; }), d3.max(data, function(d) { return d.VALUE; })]);

    // Nest the entries by stad
    dataNest = d3.nest()
        .key(function(d) {return d.STN;})
        .entries(data);

    var result = dataNest.filter(function(val,idx, arr){
    	  return $("." + val.key).attr("fill") != "#ccc"
    	  // matching the data with selector status
    	})

    console.log(result)

    var stad = svg.selectAll(".line")
        .data(result, function(d){return d.key});

    stad.enter().append("path")
        .attr("class", "line")
        .text(result, function(d){return d.TYPE});

	stad.transition()
		.style("stroke", function(d,i) { return d.color = color(d.key); })
		.attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
		.attr("d", function(d){

			return stateline(d.values)
		});

	stad.exit().remove();

    // title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 20))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Line graph showing max temp, min temp and highest avg wind speed in Schiphol (380) and Maastricht (240)");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 600))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Toon van Holthe tot Echten");

	var legend = d3.select("#legend")
		.selectAll("text")
		.data(dataNest, function(d){return d.key});

	//checkboxes
	legend.enter().append("rect")
	  .attr("width", 10)
	  .attr("height", 10)
	  .attr("x", 0)
	  .attr("y", function (d, i) { return 0 +i*15; })  // spacing
	  .attr("fill",function(d) {
	    return color(d.key);

	  })
	  .attr("class", function(d,i){return "legendcheckbox " + d.key})
		.on("click", function(d){
		  d.active = !d.active;

		  d3.select(this).attr("fill", function(d){
		    if(d3.select(this).attr("fill")  == "#ccc"){
		      return color(d.key);
		    }else {
		      return "#ccc";
		    }
		  })


	var result = dataNest.filter(function(val,idx, arr){
     return $("." + val.key).attr("fill") != "#ccc"
     // matching the data with selector status
      })

    // Hide or show the lines based on the ID
    svg.selectAll(".line").data(result, function(d){return d.key})
     .enter()
     .append("path")
     .attr("class", "line")
     .style("stroke", function(d,i) { return d.color = color(d.key); })
    .attr("d", function(d){
            return stateline(d.values);
     });

    svg.selectAll(".line").data(result, function(d){return d.key}).exit().remove()

			})

    // Add the Legend text
    legend.enter().append("text")
      .attr("x", 15)
      .attr("y", function(d,i){return 10 +i*15;})
      .attr("class", "legend");

	legend.transition()
      .style("fill", "#777" )
      .text(function(d){return d.key;});

	legend.exit().remove();

	svg.selectAll(".axis").remove();

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      var yaxis = svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(y)
          .ticks(5)
          .tickSizeInner(0)
          .tickPadding(6)
          .tickSize(0, 0));

    // Add a label to the y axis
    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - 60)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text('classes')
          .attr("class", "y axis label");


          // mouse event:


    //       var focus = svg.append("g")
    //           .attr("class", "focus")
    //           .style("display", "none");
    //
    // //       focus.append("circle")
    // //           .attr("transform", "translate(" + margin.left  + "," + margin.top + ")")
    // //           .attr("x", 4)
    // //           .attr("y", -1)
    // //           .attr("r", 2);
    //
    // //       focus.append("text")
    // //       		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // //           .attr("x", 9)
    // //           .attr("dy", ".35em");
    //
    //   for(var i=0;i<data.length;i++){
    //               focus.append("g")
    //                 .attr("class", "focus"+i)
    //                 .append("circle")
    //               	.style("stroke",  z(data[i].STN))
    //               	.style("fill", z(data[i].STN))
    //               	.attr("transform", "translate(" + margin.left  + "," + margin.top + ")")
    //                 .attr("r", 2);
    //               svg.select(".focus"+i)
    //                 .append("text")
    //               	.attr("transform", "translate(" + margin.left  + "," + margin.top + ")")
    //                 .attr("x", 9)
    //                 .attr("dy", ".35em");
    //           }
    //
    //       svg.append("rect")
    //           .attr("class", "overlay")
    //           .attr("width", width)
    //           .attr("height", height)
    //       		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //           .on("mouseover", function() { focus.style("display", null); })
    //           .on("mouseout", function() { focus.style("display", "none"); })
    //           .on("mousemove",  mousemove);
    //
    // //       function mousemove(c, j) {
    // //         console.log(c,j);
    // //         var coordinates = d3.mouse(this),
    // //         		x0 = x.invert(coordinates[0]),
    // //             y0 = y.invert(coordinates[1]),
    // //             i = bisect(c.values, x0),
    // //             d0 = c.values[i - 1],
    // //             d1 = c.values[i],
    // //             d = x0 - d0.x > d1.x - x0 ? d1 : d0;
    // // //             console.log(x0,y0,i);
    // // //         		console.log(coordinates) ;
    // //         console.log(d0,d1);
    // //         focus.attr("transform", "translate(" + x(c.values[i].x) + "," + y(c.values[i].y) + ")");
    // //         focus.select("text").text(c.values[i].y);
    // //       }
    //
    //   function mousemove() {
    //               var x0 = x.invert(d3.mouse(this)[0]);
    //               var series = data.map(function(e) {
    //                     var i = bisect(e.values, x0, 1),
    //                         d0 = e.values[i - 1],
    //                         d1 = e.values[i];
    //                     return x0 - d0.x > d1.x - x0 ? d1 : d0;
    //                   });
    // //     console.log(series);
    //               for(var i=0; i<series.length;i++){
    //                 var selectedFocus = svg.selectAll(".focus"+i);
    //                 selectedFocus.attr("transform", "translate(" + x(parseTime(series[i].x)) + "," + y(series[i].y) + ")");
    //                 selectedFocus.select("text").text(series[i].y);
    //               }
    //             }
      };





    function clearAll(){
      d3.selectAll(".line")
    	.transition().duration(100)
    			.attr("d", function(d){
            return null;
          });
    d3.select("#legend").selectAll("rect")
      .transition().duration(100)
          .attr("fill", "#ccc");
      };

    function showAll(){
      d3.selectAll(".line")
    	.transition().duration(100)
    			.attr("d", function(d){
            return stateline(d.values);
          });
      d3.select("#legend").selectAll("rect")
      .attr("fill",function(d) {
        if (d.active == true){
           return color(d.key);
         }
       })
   };
}
