'use strict';
$(function(){
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40
  };
  var canvasWidth = 600;
  var canvasHeight = 600;
  var width = canvasWidth - margin.left - margin.right;
  var height = (canvasHeight - margin.top - margin.bottom) - 45;
  var svg = d3.select('#graph')
    .append('svg')
    .attr('width', canvasWidth + 100)
    .attr('height', canvasHeight);
  
  // Text for the year of the graph
  var year = 2013;
  // creating object that displays the year
  var yearDisplay = d3.select('p').append('text')
    .text(year)

  // create staging graphArea that is positioned/transformed 
  // extra buffer added for axis titles
  var graphArea = svg.append('g')
    .attr('transform', 'translate(' + (margin.left + 45) + ',' + (margin.top + 25) + ')');
  var xScale;
  var yScale;

  // Step 1: edit data.csv to include the data you want to show
  d3.csv('data.csv', function(error, data) {
    if(error) {
      console.log('csv error: ', error);
      return;
    }
    // Step 2: Create x and y scales (scaleLinear) to draw points.     
    // create x and y scales
    xScale = d3.scaleLinear().domain([0, 11]).range([0,width]);
    yScale = d3.scaleLinear().domain([0, 36000]).range([height, 0]);

    // Step 3: Add code to color the points by category (add code here or above)
    // create color array
    var colors = ['#362204', '#eed9c4', '#ed872d','#d2b48c','#c0c0c0'];
    var labels = ['Sporting', 'Toy', 'Herding', 'Non-sporting', 'Terrier' ]
    
    // create circles
    graphArea.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', function(d) {
        var i;
        for (i = 0; i < 5; i++) {
          if (d['label'] == labels[i]) {
            return colors[i];
          } else if (d['label'] == labels[i + 1]) {
            return colors[i + 1];
          } else if (d['label'] == labels[i + 2]) {
            return colors[i + 2];
          } else if (d['label'] == labels[i + 3]) {
            return colors[i + 3];
          } else if (d['label'] == labels[i + 4]) {
            return colors[i + 4];
          } else {
            return 'blue';
          }
        }
      })
      .attr('cy', function(d) {return yScale(d['yValue_2013'])})
      .attr('cx', function(d) {return xScale(d['xValue_2013'])})
      .transition()
      .duration(200)
      .delay(function(d,i) {return i*100});
    

    // create legend box
    // Thanks to http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend
    // and https://bl.ocks.org/d3indepth/fabe4d1adbf658c0b73c74d3ea36d465        
    // var legendRectSize = 18;
    // var legendSpacing = 4;
    // var legend = svg.selectAll('.legend')
    //   .data(colors)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'legend')
    //   .attr('transform', function(d, i) {
    //     var height = legendRectSize + legendSpacing;
    //     var offset =  height * colors.length / 2;
    //     var horz = -2 * legendRectSize;
    //     var vert = i * height - offset;
    //     return 'translate(' + horz + ',' + vert + ')';
    //     });

    // create legend from Susie Liu's d3 SVG Legend (v4)
    // http://d3-legend.susielu.com/#color-quant
    var ordinal = d3.scaleOrdinal()
      .domain(labels)
      .range(colors);
    var legend = d3.select('svg');
    svg.append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(' + (margin.left + width) + ',' + (margin.top + (height/4)) + ')')
      .attr('font-family', 'sans-serif')
      .attr('fill', 'gray')
      .attr('font-size', '10px');

    var legendOrdinal = d3.legendColor()
    //d3 symbol creates a path-string, for example
    //"M0,-8.059274488676564L9.306048591020996,
    //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
    .shapePadding(10)
    //use cellFilter to hide the "e" cell
    // .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

svg.select(".legendOrdinal")
  .call(legendOrdinal);


    // adding labels
    graphArea.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(function(d) {return d['type']})
      .attr('text-anchor', 'right')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .attr('fill', 'gray')
      .attr('x', function(d) { return ((xScale(d['xValue_2013']) + 10))})
      .attr('y', function(d) {return yScale(d['yValue_2013'])});
    
    // create graph title
    // thanks to http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
    graphArea.append('text')
      .attr('x', (width / 2))             
      .attr('y', 0 - ((margin.top / 2) + 10))
      .attr('text-anchor', 'middle')  
      .style('font-size', '21px') 
      .attr('font-family', 'sans-serif')
      .style('text-decoration', 'caps')  
      .text('THE MIGHTY RISE OF THE FRENCH BULLDOG');

    // create x axis
    graphArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height) + ')')
      .call(d3.axisBottom(xScale));
    // text label for the x axis
    // thanks to https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    svg.append("text")             
      .attr("transform",
            "translate(" + ((width/2) + 75) + " ," + 
                           (height + margin.top + 70) + ")")
      .style("text-anchor", "middle")
      .attr('font-family', 'sans-serif')
      .text("Ranking of Popularity");

    // create y axis
    graphArea.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale));
    // text label for the y axis
    // thanks to https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",0 - ((height / 2) + 50))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr('font-family', 'sans-serif')
      .text("Number of Dogs in UK Households");

    // Create object variable for year to update on "Next" button click
    var originalYear = 2013;
    var maxYear = 2017;
    var year = originalYear;

    d3.select('#nextButton').on('click', function(event) {
      if (year == maxYear) {
        year = originalYear;
      } else {
        year = year + 1;
      }

      // update year displayed 
      yearDisplay
        .attr('x', 50)
        .attr('y', 250)
        .attr('fill', 'blue')
        .text(year)
      
      // update circle locations
      var xColumn = 'xValue_' + String(year);
      var yColumn = 'yValue_' + String(year);

      // create slight easing animation
      // thanks to https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe 
      graphArea.selectAll('circle')
        .data(data)
        .transition()
        .ease(d3.easeBack)
        .duration(2000)
        .attr('cy', function(d) {return yScale(d[String(yColumn)])})
        .attr('cx', function(d) {return xScale(d[String(xColumn)])});

      // update labels
      graphArea.selectAll('text')
        .data(data)
        .transition()
        .ease(d3.easeBack)
        .duration(2000)
        .text(function(d) {return d['type']})
        .attr('text-anchor', 'right')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .attr('fill', 'gray')
        .attr('x', function(d) { return (xScale(d[String(xColumn)]) + 10)})
        .attr('y', function(d) { return yScale(d[String(yColumn)])});
    });

  });
});
// Step 5: make some other change to the graph
