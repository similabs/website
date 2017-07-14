var pie_sentiment = {
    draw_chart: function(container_name, data_json, color_name) {
var width = 400,
    height = 350,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

//var y = d3.scale.linear().range([0, radius]);
var y =  d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]);

var color = d3.scale.ordinal().range([color_name, "#d6616b", "#98df8a"]);//d3.scale.category10();

var chartWidth = 240,
               spaceForLabels = 60,//150
               spaceForLegend = 100;//150
var chartHeight = 400;


var svg = d3.select(container_name).append("svg")
  //  .attr("width", width)
   // .attr("height", height)
              .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 " + (spaceForLabels + chartWidth + spaceForLegend) + " " + chartHeight)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
	
var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });



d3.json(data_json, function(error, root) {
  var g = svg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  var path = g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
    .on("click", click);

  var text = g.append("text")
    .text(function(d) { return d.name})
        
        .attr("x", function(d) { return d.x; })
        .attr("text-anchor", "middle")
        // translate to the desired point and set the rotation
        .attr("transform", function(d) {
            if (d.depth > 0) {
                return "translate(" + arc.centroid(d) + ")" +
                       "rotate(" + getAngle(d) + ")";
            }  else {
                return null;
            }
        })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .attr("pointer-events", "none");

  function click(d) {
    // fade out all text elements
    text.transition().attr("opacity", 0);

    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d))
      .each("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(750)
              .attr("opacity", 1)
              .attr("transform", function(d) {
            if (d.depth > 0) {
                return "translate(" + arc.centroid(d) + ")" +
                       "rotate(" + getAngle(d) + ")";
            }  else {
                return null;
            }
        })
              .attr("x", function(d) { return d.x; })
          }
      });
  }
});

d3.select(self.frameElement).style("height", height + "px");

// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}

function getAngle(d) {
    // Offset the angle by 90 deg since the '0' degree axis for arc is Y axis, while
    // for text it is the X axis.
    var thetaDeg = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
    // If we are rotating the text by more than 90 deg, then "flip" it.
    // This is why "text-anchor", "middle" is important, otherwise, this "flip" would
    // a little harder.
    return (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg;
}

}
};