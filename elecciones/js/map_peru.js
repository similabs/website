/**
 * Created by Sonia on 4/3/2016.
 */

function mapDrawPeru(candidate){

  d3.select("svg").remove();
var width = 600,
  height = 600,
  scale = 6500,
  translateX = -240,
  translateY = 7260,
  legendRectSize = 18,
  legendSpacing = 4,
  data;

var projection = d3.geo.mercator()
  .scale(1800)
  .center([-75, -9.4]) //projection center
  .translate([width / 2, height / 2]) //translate to center the map in view

var path = d3.geo.path().projection(projection);
var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomhandler);

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "map");////

var features = svg.append("g")
  .attr("class", "features");




var color = d3.scale.ordinal()
  .domain(["Muy Positivo", "Positivo ", "Neutro", "Negativo", "Muy Negativo"])
  .range(["#3A8F10", "#9ACD32", "#EEDD82", "#FF6347", "#FF0000"]);

  // color scale going from red to blue
// for the domain 10 - 500.
  /*
  var colorScale = d3.scale.linear()
      .range(["red", "blue"])
      .domain([10,500])
      .interpolate(d3.interpolateLab);

  var legend = d3.select("svg")
      .append("g")
      .chart("HorizontalLegend")
      .height(20)
      .width(300)
      .padding(4)
      .boxes(30);

  legend.draw(colorScale);
*/

var legend = d3.select("svg")
  .append("g")
  .selectAll("g")
  .data(color.domain())
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) {
    var height = legendRectSize;
    var x = 0;
    var y = i * height;
    return "translate(" + x + "," + y + ")";
  });

legend.append("rect")
  .attr("width", legendRectSize)
  .attr("height", legendRectSize)
  .style("fill", color)
  .style("stroke", color);

legend.append("text")
  .attr("x", legendRectSize + legendSpacing)
  .attr("y", legendRectSize - legendSpacing)
  .text(function(d) { return d; });

//Add a div to the section containing the map to hold the tooltip information
var tooltipMap = d3.select("body")
  .append("div")
  .attr("class", "tooltipMap")
  .style("opacity", 0);


d3.json("data/regions_peru.json", function(error, geodata) {
  features.selectAll("path")
    .data(topojson.feature(geodata, geodata.objects.regiones_peru).features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);



  features.selectAll("text")
    .data(topojson.feature(geodata, geodata.objects.regiones_peru).features)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .text(function(d) { return d.properties.name;} )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);






  d3.json("data/map_peru.json", function(json){

    if(candidate == "accionpopular"){
      data = json.accionpopular;
    }
    if(candidate == "alianzapopular"){
      data = json.alianzapopular;
    }
    if(candidate == "democraciadirecta"){
      data = json.democraciadirecta;
    }
    if(candidate == "frenteamplio"){
      data = json.frenteamplio;
    }
    if(candidate == "frenteesperanza"){
      data = json.frenteesperanza;
    }
    if(candidate == "fuerzapopular"){
      data = json.fuerzapopular;
    }
    if(candidate == "partidopoliticoorden"){
      data = json.partidopoliticoorden;
    }
    if(candidate == "peruanosporelcambio"){
      data = json.peruanosporelcambio;
    }
    if(candidate == "peruposible"){
      data = json.peruposible;
    }
    if(candidate == "progresandoperu"){
      data = json.progresandoperu;
    }



    features.selectAll("path")
      .attr("class", quantify);


  });
});

function quantify(d) {
  console.log(d.properties.name);
  if(d.properties.name != "Lago"){
    var f = data[d.properties.name].menciones;
    var sentimentPos = data[d.properties.name].positivo;
    var sentimentNeg = data[d.properties.name].negativo;
    if(sentimentPos>sentimentNeg){
      if(sentimentPos == 100){
        return "qpos0-9";
      }
      if(sentimentPos>= 0 && sentimentPos<20){
        return "qpos3-9";
      }
      if(sentimentPos>= 20 && sentimentPos<60){
        return "qpos2-9";
      }
      if(sentimentPos>= 60 && sentimentPos<80){
        return "qpos1-9";
      }
      if(sentimentPos>= 80 && sentimentPos<100){
        return "qpos0-9";
      }
    }
    else{
      if(sentimentNeg == 100){
        return "qneg0-9";
      }
      if(sentimentNeg>= 0 && sentimentNeg<20){
        return "qneg3-9";
      }
      if(sentimentNeg>= 20 && sentimentNeg<60){
        return "qneg2-9";
      }
      if(sentimentNeg>= 60 && sentimentNeg<80){
        return "qneg1-9";
      }
      if(sentimentNeg>= 80 && sentimentNeg<100){
        return "qneg0-9";
      }
    }

  }
  else{
    return "qlago";
  }

}

//svg.selectAll("path")
//       .attr("class", 'q0-9')


function zoomhandler() {
  alert("fdgdg");
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
    .style("font-size", function(){return 12 / d3.event.scale + "px";});
}

//Make the tooltip visible with CSS transition
function mouseover(){
  tooltipMap.transition()
    .duration(200)
    .style("opacity", .9);
}

//Add the data you want to display to the tooltip. The province that is hovered and the number of arrests in that province.
//Position the left side of the tooltip at the same left offset as the mouse cursor,
//Position the tooltip 50px above the cursor

function mousemove(d){
  tooltipMap.html(d.properties.name  + "<br/>"  +  data[d.properties.name].positivo + "% Positivos" + "<br/>"  +  data[d.properties.name].negativo + "% Negativos"  )
    .style("left", (d3.event.pageX+20) + "px")
    .style("top", (d3.event.pageY - 55) + "px");
}

//Hide the tooltip whit CSS transition when you are no longer hover over it
function mouseout(){
  tooltipMap.transition()
    .duration(500)
    .style("opacity", 0);
}
}
