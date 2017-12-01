// source http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
window.onload = function(){

    function filterJSON(json, key, value) {
      var result = [];
      json.forEach(function(val,idx,arr){

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
        .style("font-size", "12px")
        .style("text-decoration", "underline")
        .text("Line graph showing max temp(TX), min temp(T10N) and highest avg wind speed(FHX) in Schiphol(380) and Maastricht(240)");

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
      .text(function(d){return d.key + ' click me!';})

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
          .text(function(d, i){return result[i].values[0]['TYPE']})
          .attr("class", "y axis label");

      // mouse over event
      // https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

      var mouseG = svg.append("g")
            .attr("class", "mouse-over-effects");

          mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

          var lines = document.getElementsByClassName('line');

          var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(dataNest)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

          mousePerLine.append("circle")
            .attr("r", 7)
            .style("stroke", function(d) {
              return color(d.STN);
            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");

          mousePerLine.append("text")
            .attr("transform", "translate(10,3)");

          mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
              d3.select(".mouse-line")
                .style("opacity", "0");
              d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
              d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
              d3.select(".mouse-line")
                .style("opacity", "1");
              d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
              d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
            })
            .on('mousemove', function() { // mouse moving over canvas
              var mouse = d3.mouse(this);
              d3.select(".mouse-line")
                .attr("d", function() {
                  var d = "M" + mouse[0] + "," + height;
                  d += " " + mouse[0] + "," + 0;
                  return d;
                });

              d3.selectAll(".mouse-per-line")
                .attr("transform", function(d, i) {
                  var xDate = x.invert(mouse[0]),
                      bisect = d3.bisector(function(d) { return d.DATE; }).right;
                      idx = bisect(d.values, xDate);

                  var beginning = 0,
                      end = lines[i].getTotalLength(),
                      target = null;

                     console.log(lines[i])

                  while (true){
                    target = Math.floor((beginning + end) / 2);
                    pos = lines[i].getPointAtLength(target);
                    if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                        break;
                    }
                    if (pos.x > mouse[0])      end = target;
                    else if (pos.x < mouse[0]) beginning = target;
                    else break; //position found
                  }

                  d3.select(this).select('text')
                    .text(y.invert(pos.y).toFixed(2));

                  return "translate(" + mouse[0] + "," + pos.y +")";
                });
            });
        }
    }

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
