(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height =1000,
      width = 1000 ;
  
  var svg = d3.select("#chart ")
      .append("svg")
      .attr("height", height )
      .attr("width", width )
      .append("g")
      .attr("transform", "translate(0,0)")

//the good stuff. . .adding the images

var defs = svg.append("defs");



//how to scale the size of the circles, is dependent on the size of the data
  var radiusScale = d3.scaleSqrt()
    .domain([0, 1])
    .range([0, 40])

  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.wins) + 2
    }))

  d3.queue()
    .defer(d3.csv, "superbowl.csv")
    .await(ready) 

  function ready (error, datapoints) {

    defs.selectAll("pattern")
         .data(datapoints)
          .enter().append("pattern")
         .attr("class", "pattern")
         .attr("id", function(d) {
           return d.team
         })
          .attr("height","100%")
          .attr("width","100%")
          .attr("PatternContentUnits","ObjectBoundingBox")
          .append("image")
          .attr("height",1)
          .attr("width",1) 
          .attr("preserveAspectRatio","none")
          .attr("xlink:href",function(d) {
            return d.image_path
          });  


    // Add a circle for every datapoint
   var circles= svg.selectAll(".artist")
      .data(datapoints)
      .enter().append("circle")
      .attr("class","artist-pattern")
      .attr('r', function(d) {
        return radiusScale(d.wins)
      })


     //this fill is supposed to work but turns the images black (if the name doesn't match) or white (name matches)
      .attr('fill', function(d) {
      return "url(#" +d.team+ ")"
      })
    
      .on("click", function(d) {
        console.log(d)
      });
     
     
   var titles = svg.selectAll("circle")
      .append('title')
      .text( function(d) {
        return d.id
      });

    


    
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
      simulation.alphaTarget(0.4).restart()
    })

    d3.select("#no-conferences").on('click', function() {
      // Go back to the middle EVERYONE
      simulation.force("x", d3.forceX(width /2))
      // Now restart the simulation
      simulation.alphaTarget(0.4).restart()
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



