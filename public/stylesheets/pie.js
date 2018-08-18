//margin and radius
var margin = { top: 20, right: 20, left:20},
width = 500 -margin.right - margin.left,
height = 500 - margin.top - margin.bottom,
radius = width/2;

//arc centroid
var labelarc = d3.arc()
.outerRadius(radius - 50)
.innerRadius(radius - 50)

//arc generation
var arc = d3.arc()
.outerRadius(radius - 10)
.innerRadius(0);

var pie = d3.pie()
.sort(null)
.value(function(d) {return d.percent;
});

//define svg
var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width/2 + " , " + height/2 + ")");

//import data
d3.csv("data.csv", function(error, data){
    if(error) throw error;
    //parsing
    data.forEach(function(d){
        d.percent = +d.percent// for count;
        d.name = d.name// for fruit;
    });
//arc element
var g = svg.selectAll(".arc")
.data(pie(data))
.enter().append("g")
.attr("class", "arc");

//append the path of arc
g.append("path"
.attr("d", arc)
.style("fill", function(d) { return color(d.data.fruit); 
})
 )
//append text labels
g.append("text")
.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
.attr("dy", ".35en")
.text(function(d) { return d.data.name;})

//color
var color = d3.scaleOrdinal()
.range(["" , "" ])
});