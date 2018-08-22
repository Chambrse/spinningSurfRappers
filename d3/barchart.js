var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
//data.csv instead bar-data.csv
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

          var url ='http://localhost:8080'
 //fetch data from rest API
 d3.json(url, function(error, data){
     if(error) throw error;

     //emotion instead of date	
  x.domain(data.map(function(d) { return d.Emotion; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  //x Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

      //y Axis
      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

      //populate bars from data returned from rest API
      svg.SelectAll('.bar')
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")

      //on x axis plot using product names
      .attr("x", function(d) { return x(d.name);})
      //.attr("x", "")
      .attr("width", x.rangeBand())

      //on y axis plot using values
      .attr("y", function(d) {return y(d.values); });
    }) ;
      function type(d){
    d.frequency = + Math.random();
    return d;
      }
      
    
