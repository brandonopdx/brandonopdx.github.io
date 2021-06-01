(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height =1000,
      width = 1000 ;
  
      var svg = d3.select("#chart")
      .append("svg")
      .attr("height", height )
      .attr("width", width )
      .append("g")
      .attr("transform", "translate(0,0)")
      

//the good stuff. . .adding the images

var defs = svg.append("pattern");



//how to scale the size of the circles, is dependent on the size of the data
  var radiusScale = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, 40])

  var forceX = d3.forceX(function(d) {
     return width/2
   }).strength(0.1)

   var forceCollide = d3.forceCollide(function(d) {
     return radiusScale(d.wins) +2
   })


  var simulation = d3.forceSimulation()
    .force("x", forceX)
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("collide", forceCollide)

  d3.queue()
    .defer(d3.csv, "superbowl.csv")
    .await(ready) 

  function ready (error, datapoints) {


   var tooltip = d3.select("body")
    .append("div")
   .style("position", "absolute")
    .style("z-index", "14")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");  


    // Add a circle for every datapoint
   var circles= svg.selectAll(".artist")
    .data(datapoints)
    
     .enter().append("circle")
      .attr('fill', function(d) {
        return "url(#" +d.team+ ")"
        })
      
      .attr("class","artist")
      .attr('r', function(d) {
        return radiusScale(d.wins)
      })
      

  


    .on("mouseover", function(d) {
      
     tooltip.html(d.id+": " +d.wins+ "<br>"+ d.years)
   
    tooltip.style("left", (d3.mouse(this)[0]+30) + "px")
      tooltip.style("top", (d3.mouse(this)[1]+30) + "px")
       tooltip.style("visibility", "visible")
       tooltip.transition()
  
      
})

   .on("mouseleave", function(d) {
      tooltip.transition()
      tooltip.duration(200)
      tooltip.style("opacity", 0)
      tooltip.style("visibility", "hidden")

    })


    
     

     //this fill is supposed to work but turns the images black (if the name doesn't match) or white (name matches)
     

     
     
     
  //this is using standard title tag. commented out for now.

  // var titles = svg.selectAll("circle")
  // .append('title')
  // .text( function(d) {
  //   return d.id + ': ' + d.wins
 //  });


    
 
     //We'll use this later
    // Hey simulation, here are our datapoints!

    simulation.nodes(datapoints)
      .on('tick', ticked)

    d3.select("#conference").on('click', function() { 
      var splitForce = d3.forceX(function(d) {
        if(d.conference === "AFC") {
          return width * 0.3
        } else {
          return width * 0.7
        }
      }).strength(1)
      // some of you go left, some of you go right
      simulation.force("x", splitForce)
      // Now restart the simulation
      simulation.alphaTarget(0.25).restart()
    }) 

    d3.select("#no-conferences").on('click', function() {
      // Go back to the middle EVERYONE
      simulation.force("x", d3.forceX(width /2))
      // Now restart the simulation
      simulation.alphaTarget(0.25).restart()
    })
  
    // We'll use this later
    function ticked() {
      svg.selectAll("circle")
          .attr("cx", function(d) { 
            return d.x;
          })
          .attr("cy", function(d) { 
            return d.y; });
    }

  }



})();



