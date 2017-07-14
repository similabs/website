 var bar_sentiment = {
 draw_chart: function(container_name, data_json) {
   var candidateData=[
       {label:"Positivo", color:"LimeGreen"},
       {label:"Negativo", color:"#ff3333"},
       {label:"Neutro", color:"#BDB76B"}
   ];
   // Define the div for the tooltip
   var div = d3.select("body").append("div")
           .attr("class", "tooltip")
           .style("opacity", 0);

   d3.json(data_json, function(error, data) {
       if (error) throw error;
       var chartWidth = 300,
               barHeight = 20,
               groupHeight = barHeight * data.series.length,
               gapBetweenGroups = 10,
               spaceForLabels = 60,//150
               spaceForLegend = 100;//150

       // Zip the series data together (first values, second values, etc.)
       var zippedData = [];
       for (var i = 0; i < data.labels.length; i++) {
           for (var j = 0; j < data.series.length; j++) {
               zippedData.push(data.series[j].values[i]);
           }
       }

       // Color scale
       //var color = d3.scale.category20();

       var colorAux = ["LimeGreen", "#ff3333", "#BDB76B"];
       var color = d3.scale.linear()
               .domain([0, 1, 2])
               .range(["LimeGreen", "#ff3333", "#BDB76B"]);

       var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

       var x = d3.scale.linear()
               .domain([0, d3.max(zippedData)])
               .range([0, chartWidth]);

       var y = d3.scale.linear()
               .range([chartHeight + gapBetweenGroups, 0]);

       var yAxis = d3.svg.axis()
               .scale(y)
               .tickFormat('')
               .tickSize(0)
               .orient("left");


       // Specify the chart area and dimensions
       var chart = d3.select(container_name)
           .append("svg")
              // .attr("width", spaceForLabels + chartWidth + spaceForLegend)
              // .attr("height", chartHeight)
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 " + (spaceForLabels + chartWidth + spaceForLegend) + " " + chartHeight)
           .append("g");

       // Create bars
       var bar = chart.selectAll("g")
               .data(zippedData)
               .enter().append("g")
               .attr("transform", function (d, i) {
                   return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
               });

       // Create rectangles of the correct width
       bar.append("rect")
               .attr("fill", function (d, i) {
                   d.color=color(i % data.series.length);//saving the original color
                   return color(i % data.series.length);
               })
               .attr("class", "bar")
               .attr("width", x)
               .attr("height", barHeight - 1)
               .on("mouseover", function(d,i) {
                   var name =  data.labels[Math.floor(i / data.series.length)];
                   var nrotweet =  data.tweets[i];
                   var colore = colorAux[i % data.series.length];
                   d3.select(this).style("opacity", .7);
                   div.transition()
                           .duration(200)
                           .style("opacity", .9);
                   div.html("<b>"+name + "</b><br/>" +
                           "<HR width=80\% align=\"center\"  size=5 color=" + colore +" style=\"height:3px; border:1px " + colore + "; margin-top:6px; margin-bottom:6px \"" + ">"
                           //+ "% de tuit: " + d 
                           + "Nro de tweets: "+ nrotweet)
                           .style("left", (d3.event.pageX+29) + "px")
                           .style("top", (d3.event.pageY - 58) + "px");
               })
               .on("mouseout", function(d) {
                   d3.select(this)
                           .style("fill", function (d, i) {
                       return d.color;
                   })
                           .style("opacity", .9);
                   div.transition()
                           .duration(500)
                           .style("opacity", 0);
               });;
      
        bar.append("svg:image")
                .attr("xlink:href", function (d, i) {
                if (i % data.series.length === 0){
                      return data.images[Math.floor(i / data.series.length)];

                }
                else
                      return "";
                })
                .attr("width", 50)
                .attr("height", 50)
                .attr("x", function (d) {
                        return -60;
                })
                .attr("y", 0);

       // Add text label in bar
       bar.append("text")
               .attr("x", function (d) {
                   return x(d) - 3;
               })
               .attr("y", barHeight / 2)
               .attr("fill", "red")
               .attr("dy", ".35em")
               .text(function (d) {
                   return d + "%";
               });

       // Draw labels
       /*bar.append("text")
               .attr("class", "label")
               .attr("x", function (d) {
                   return -10;
               })
               .attr("y", groupHeight / 2)
               .attr("dy", ".35em")
               .text(function (d, i) {
                   if (i % data.series.length === 0){
                       return data.labels[Math.floor(i / data.series.length)];

                   }
                   else
                       return ""
               });*/

       chart.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
               .call(yAxis);




       /////////////

               var svg = d3.select(".donut").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", '0 0 300 300');
			   
			   
			   //.attr("width",500).attr("height",450);

               svg.append("g").attr("id","salesDonut");
               //svg.append("g").attr("id","quotesDonut");

               Donut3D.draw("salesDonut", randomData(), 250, 250, 130, 100, 30, 0.4);
              // Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);

              // function changeData(){
              //     Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
               //    Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
             //  }

               function randomData(){
                   var i =-1;
                       return candidateData.map(function (d) {
                           if(i<=2) {i++;
                           return {label: d.label, value: data.summary[i], color: d.color};
                           }
                       });

               }

       ////
               // Draw legend
       var legendRectSize = 18,
               legendSpacing = 4;

       var legend = chart.selectAll('.legend')
               .data(data.series)
               .enter()
               .append('g')
               .attr('transform', function (d, i) {
                   var height = legendRectSize + legendSpacing;
                   var offset = -gapBetweenGroups / 2;
                   var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
                   var vert = i * height - offset;
                   return 'translate(' + horz + ',' + vert + ')';
               });

       legend.append('rect')
               .attr('width', legendRectSize)
               .attr('height', legendRectSize)
               .style('fill', function (d, i) {
                   return color(i);
               })
               .style('stroke', function (d, i) {
                   return color(i);
               });

       legend.append('text')
               .attr('class', 'legend')
               .attr('x', legendRectSize + legendSpacing)
               .attr('y', legendRectSize - legendSpacing)
               .text(function (d) {
                   return d.label;
               });
   }
   )

}
};