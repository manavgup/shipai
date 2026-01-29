// reference-lines.js - Adds reference lines like human baseline and ideal threshold

const ReferenceLines = {
  // Add reference lines to the visualization
  addReferenceLines: function(visualizer) {
    this.addHumanBaselineLine(visualizer);
    this.addIdealThresholdLine(visualizer);
  },
  
  // Add a horizontal line representing human expert level (89.8)
  addHumanBaselineLine: function(visualizer) {
    // Remove any existing human baseline line
    visualizer.g.selectAll(".human-baseline").remove();
    visualizer.g.selectAll(".human-baseline-label").remove();
    
    const humanMMluScore = 89.8;
    const y = visualizer.mmluScale(humanMMluScore);
    
    // Add the line
    visualizer.g.append("line")
      .attr("class", "human-baseline")
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", visualizer.innerWidth)
      .attr("y2", y)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .attr("opacity", 1);
      
    // Add the label with box
    const labelGroup = visualizer.g.append("g")
      .attr("class", "human-baseline-label")
      .attr("opacity", 0)
      .attr("transform", `translate(5, ${y - 15})`);
    
    // Background box for the label
    labelGroup.append("rect")
      .attr("x", -2)
      .attr("y", -12)
      .attr("width", 160)
      .attr("height", 16)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("rx", 2);
    
    // Text label
    labelGroup.append("text")
      .text(`89.8 = human expert`)
      .attr("y", 0);
      
    // Fade in the label
    labelGroup.transition()
      .delay(500)
      .duration(1000)
      .attr("opacity", 1);
  },
  
  // Add a horizontal line representing the 70+ ideal threshold
  addIdealThresholdLine: function(visualizer) {
    // Remove any existing ideal threshold line
    visualizer.g.selectAll(".ideal-threshold").remove();
    visualizer.g.selectAll(".ideal-threshold-label").remove();
    
    const idealThreshold = 70;
    const y = visualizer.mmluScale(idealThreshold);
    
    // Add the line
    visualizer.g.append("line")
      .attr("class", "ideal-threshold")
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", visualizer.innerWidth)
      .attr("y2", y)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .attr("opacity", 1);
      
    // Add the label with box
    const labelGroup = visualizer.g.append("g")
      .attr("class", "ideal-threshold-label")
      .attr("opacity", 0)
      .attr("transform", `translate(5, ${y - 15})`);
    
    // Background box for the label
    labelGroup.append("rect")
      .attr("x", -2)
      .attr("y", -12)
      .attr("width", 120)
      .attr("height", 16)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("rx", 2);
    
    // Text label
    labelGroup.append("text")
      .text(`▲ 70+ IDEAL ▲`)
      .attr("y", 0);
      
    // Fade in the label
    labelGroup.transition()
      .delay(500)
      .duration(1000)
      .attr("opacity", 1);
  },
  
  // Remove all reference lines
  removeReferenceLines: function(visualizer) {
    visualizer.g.selectAll(".human-baseline").remove();
    visualizer.g.selectAll(".human-baseline-label").remove();
    visualizer.g.selectAll(".ideal-threshold").remove();
    visualizer.g.selectAll(".ideal-threshold-label").remove();
  }
};