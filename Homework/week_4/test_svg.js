// Toon van Holthe tot Echten
// 10798595
// script to create legend using d3

// load legend svg
d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    // vars
    var W_BOX = 21
    var H_BOX = 29
    var X_BOX = 13
    var X_TEXT = 46.5
    var SPACE = 40

    // create dict with values
    var dict = {'classes': [
                            {
                              'id': 1 , 'color': '#ccece6' ,'number': '100'
                            },
                            {
                              'id': 2 , 'color': '#99d8c9' ,'number': '1000'
                            },
                            {
                              'id': 3 , 'color': '#66c2a4' ,'number': '10000'
                            },
                            {
                              'id': 4 , 'color': '#41ae76' ,'number': '100000'
                            },
                            {
                              'id': 5 , 'color': '#238b45' ,'number': '1000000'
                            },
                            {
                              'id': 6 , 'color': '#005824' ,'number': '10000000'
                            },
                            {
                              'id': 7 , 'color': 'grey' ,'number': 'Unknown Data'
                            },
                          ]
                        };

    // add rectangles filled with colors from data site
    d3.select('#Laag_1').selectAll('.st1').data(dict.classes)
                                      .enter()
                                      .append('rect')
                                      .attr('width', W_BOX)
                                      .attr('height', H_BOX)
                                      .attr('id', (function(d, i) {return dict.classes[i].id;}))
                                      .attr('x', X_BOX)
                                      .attr('y', (function(d, i) {return 10 + i * SPACE;}))
                                      .style("fill", (function(d, i) {return dict.classes[i].color;}))
                                      

    // add numbers from dict in same color as the rects
    d3.select('#Laag_1').selectAll('.st2').data(dict.classes)
                                      .enter()
                                      .append('text')
                                      .attr('x', X_TEXT)
                                      .attr('y', (function(d, i) {return 30 + i * SPACE;}))
                                      .attr('font-family', "Verdana")
                                      .attr('fill' , (function(d, i) {return dict.classes[i].color;}))
                                      .text(function(d, i) {return dict.classes[i].number;})

  });
