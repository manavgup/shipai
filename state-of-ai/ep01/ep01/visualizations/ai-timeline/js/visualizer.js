// visualizer.js - Handles the D3.js visualization

const Visualizer = {
  // D3 visualization elements
  svg: null,
  g: null,
  width: 0,
  height: 0,
  margin: { top: 50, right: 50, bottom: 70, left: 50 },
  innerWidth: 0,
  innerHeight: 0,
  
  // Scales and axes
  timeScale: null,
  mmluScale: null,
  rScale: null,
  colorScale: null,
  xAxis: null,
  yAxis: null,
  
  // dynamic timeline
  dynamicTimeline: null,
  referenceLines: null,
  animationControls: null,
  latestData: null,
  latestFilters: null,

  // Tooltip
  tooltip: null,
  
  // Animation state
  isInitialRender: true,
  
  // Initialize the visualization container
  initialize: function() {
    // Select the SVG element
    this.svg = d3.select("#timeline");
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    // init dynamic timeline
    this.dynamicTimeline = DynamicTimeline.initialize(this);

    // Initialize the reference lines
    this.referenceLines = ReferenceLines;

    // Initialize animation controls
    this.animationControls = AnimationControls.initialize(
      this.dynamicTimeline, 
      this.dynamicTimeline.config.timePeriods.length
    );
    
    // Clear any existing elements
    this.svg.selectAll("*").remove();
    
    // Create the main group element with margins
    this.g = this.svg.append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    
    // Create tooltip if it doesn't exist
    if (!this.tooltip) {
      this.tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    }
    
    // Initialize scales
    this.initializeScales();
    
    // Create axes
    this.createAxes();
    
    // Add legends
    this.createLegends();
    
    return this;
  },
  
  // Initialize the scales for the visualization
  initializeScales: function() {
    // Time scale for x-axis
    this.timeScale = d3.scaleTime()
      .domain([new Date(2017, 0, 1), new Date(2025, 11, 31)])
      .range([0, this.innerWidth]);
    
    // Scale for y-axis (MMLU)
    this.mmluScale = d3.scaleLinear()
      .domain([0, 100])
      .range([this.innerHeight, 0]);
    
    // Scale for circle radius (parameter count)
    this.rScale = d3.scaleSqrt()
      .domain([0.1, 1000])
      .range([5, 35]);
    
    // Color scale for source type
    this.colorScale = d3.scaleOrdinal()
      .domain(["Open", "Closed"])
      .range(["#4285F4", "#DB4437"]);
  },
  
  // Create the axes for the visualization
  createAxes: function() {
    // Create x-axis
    this.xAxis = this.g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.innerHeight})`);
    
    // Add x-axis label
    this.g.append("text")
      .attr("class", "axis-label")
      .attr("x", this.innerWidth / 2)
      .attr("y", this.innerHeight + 40)
      .attr("text-anchor", "middle")
      .text("Release Date");
    
    // Create y-axis
    this.yAxis = this.g.append("g")
      .attr("class", "y-axis");
    
    // Add y-axis label
    this.yAxisLabel = this.g.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .text("MMLU Score (%)");
  },
  
  // Create legends for the visualization
  createLegends: function() {
    // Create source type legend
    const legend = this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.width - this.margin.right - 120}, ${this.margin.top})`);
    
    // Open source legend item
    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 6)
      .attr("fill", this.colorScale("Open"));
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 15)
      .text("Open Source");
    
    // Closed source legend item
    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 30)
      .attr("r", 6)
      .attr("fill", this.colorScale("Closed"));
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", 35)
      .text("Closed Source");
    
    // Create size legend
    const sizeLegend = this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.margin.left + this.innerWidth/2 - 150}, ${this.height - 20})`);
    
    const sizeLabels = [
      { size: 5, label: "5B params" },
      { size: 50, label: "50B params" },
      { size: 500, label: "500B+ params" }
    ];
    
    // Create a horizontal layout of size circles
    let offsetX = 0;
    sizeLabels.forEach((item) => {
      const radius = this.rScale(item.size);
      const textWidth = 80; // Approximate text width
      
      sizeLegend.append("circle")
        .attr("cx", offsetX + radius)
        .attr("cy", 0)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "#666");
      
      sizeLegend.append("text")
        .attr("x", offsetX + 2*radius + 5)
        .attr("y", 5)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .text(item.label);
      
      offsetX += 2*radius + textWidth;
    });
  },
  
  // Format the time axis with custom ticks
  formatTimeAxis: function() {
    // Generate custom tick values for years and quarters
    let tickValues = [];
    
    // Yearly ticks for 2017-2021
    for (let year = 2017; year <= 2021; year++) {
      tickValues.push(new Date(year, 0, 1));
    }
    
    // Quarterly ticks for 2022 onwards
    for (let year = 2022; year <= 2025; year++) {
      for (let quarter = 0; quarter < 4; quarter++) {
        tickValues.push(new Date(year, quarter * 3, 1));
      }
    }
    
    // Format tick labels
    const tickFormat = (date) => {
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      
      if (year <= 2021 || date.getMonth() === 0) {
        return year.toString();
      } else {
        return `Q${quarter} ${year}`;
      }
    };
    
    // Update x-axis with custom ticks
    this.xAxis.call(
      d3.axisBottom(this.timeScale)
        .tickValues(tickValues)
        .tickFormat(tickFormat)
    )
    .selectAll("text")
    .attr("y", 10)
    .attr("x", -5)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");
  },
  
  // Update the chart with new data and filters
  update: function(data, filters) {
    // Save the latest data and filters
    this.setLatestData(data, filters);

    // Format the time axis
    this.formatTimeAxis();
    
    // Update the y-axis visibility
    if (filters.showMMLU) {
      this.yAxis.style("visibility", "visible")
        .call(d3.axisLeft(this.mmluScale).ticks(5));
      this.yAxisLabel.style("visibility", "visible");
    } else {
      this.yAxis.style("visibility", "hidden");
      this.yAxisLabel.style("visibility", "hidden");
    }
    
    // Run a force simulation to position the models
    const simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(d => this.timeScale(d.releaseDate)).strength(1))
      .force("y", d3.forceY(d => {
        if (filters.showMMLU && d.mmlu !== null) {
          return this.mmluScale(d.mmlu); // Position by MMLU if available
        } else {
          return this.innerHeight / 2; // Center vertically if no MMLU
        }
      }).strength(filters.showMMLU ? 1 : 0.05))
      .force("collide", d3.forceCollide(d => {
        // Use a default size for models with unknown parameters
        return d.parameters ? this.rScale(d.parameters) + 2 : this.rScale(30) + 2;
      }))
      .stop();
    
    // Run the simulation for enough iterations
    for (let i = 0; i < 120; i++) simulation.tick();
    
    // Remove old labels
    this.g.selectAll(".model-label").remove();
    
    // Clear existing visualization
    this.g.selectAll("circle.model-circle").remove();
    
    // Decide between initial render (chronological animation) or normal update
    if (this.isInitialRender) {
      this.dynamicTimeline.startAnimation(data, filters);
    } else {
      this.renderAllModels(data, filters);
    }
  },
  
  // Render all models at once (for filter updates)
  renderAllModels: function(data, filters) {
    const self = this;
    
    // If no data, show message
    if (data.length === 0) {
      // Add "No data" message to the center of the chart
      this.g.append("text")
        .attr("class", "no-data-message")
        .attr("x", this.innerWidth / 2)
        .attr("y", this.innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("No models match the current filters");
      return;
    }
    
    // DATA JOIN: bind the data to circles
    const circles = this.g.selectAll("circle.model-circle")
      .data(data, d => d.model);
    
    // EXIT: remove circles that are no longer needed
    circles.exit()
      .transition()
      .duration(500)
      .attr("r", 0)
      .remove();
    
    // UPDATE: update positions and sizes of existing circles
    circles.transition()
      .duration(500)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.parameters ? this.rScale(d.parameters) : this.rScale(30))
      .attr("fill", d => this.colorScale(d.source))
      .attr("opacity", d => filters.showMMLU && d.mmlu === null ? 0.4 : 0.8);
    
    // ENTER: create new circles for new data points
    circles.enter().append("circle")
      .attr("class", "model-circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 0)
      .attr("fill", d => this.colorScale(d.source))
      .attr("opacity", d => filters.showMMLU && d.mmlu === null ? 0.4 : 0.8)
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        self.tooltip.transition().duration(200).style("opacity", 0.9);
        
        let mmluInfo = "";
        if (d.mmlu !== null) {
          mmluInfo = `<p>MMLU Score: ${d.mmlu}%</p>`;
        } else {
          mmluInfo = "<p>MMLU Score: Not available</p>";
        }
        
        let releaseInfo = `${d.releaseYear}`;
        if (d.releaseYear >= 2022) {
          releaseInfo = `Q${d.releaseQuarter} ${d.releaseYear}`;
        }
        
        let paramInfo = d.parameters ? `${d.parameters}B` : "Unknown";
        
        self.tooltip.html(`
          <h4>${d.model}</h4>
          <p>Provider: ${d.provider}</p>
          <p>Released: ${releaseInfo}</p>
          <p>Parameters: ${paramInfo}</p>
          <p>Source: ${d.source}</p>
          ${mmluInfo}
        `)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
        
        // Highlight the current circle
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "#000");
      })
      .on("mouseout", function() {
        self.tooltip.transition().duration(500).style("opacity", 0);
        
        // Remove highlight
        d3.select(this)
          .attr("stroke-width", 1)
          .attr("stroke", "#333");
      })
      .transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .attr("r", d => d.parameters ? self.rScale(d.parameters) : self.rScale(30));
    
    // Add labels if enabled
    if (filters.showLabels) {
      this.g.selectAll(".model-label")
        .data(data, d => d.model)
        .enter()
        .append("text")
        .attr("class", "model-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y + (d.parameters ? self.rScale(d.parameters) : self.rScale(30)) + 10)
        .text(d => d.model)
        .attr("opacity", 0)
        .transition()
        .delay((d, i) => i * 50 + 500)
        .duration(500)
        .attr("opacity", 1);
    }
  },
  
  // Render models chronologically (for initial render)
  renderChronologically: function(data, filters) {
    const self = this;
    
    // Group models by time periods
    const periods = new Map();
    
    // Group early years by year
    for (let year = 2017; year <= 2021; year++) {
      const yearModels = data.filter(d => d.releaseYear === year);
      if (yearModels.length > 0) {
        periods.set(`${year}`, yearModels);
      }
    }
    
    // Group 2022-2023 by quarter
    for (let year = 2022; year <= 2023; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const quarterModels = data.filter(d => 
          d.releaseYear === year && d.releaseQuarter === quarter
        );
        if (quarterModels.length > 0) {
          periods.set(`Q${quarter} ${year}`, quarterModels);
        }
      }
    }
    
    // Group 2024+ by quarter
    for (let year = 2024; year <= 2025; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const quarterModels = data.filter(d => 
          d.releaseYear === year && d.releaseQuarter === quarter
        );
        if (quarterModels.length > 0) {
          periods.set(`Q${quarter} ${year}`, quarterModels);
        }
      }
    }
    
    // Sort periods chronologically
    const sortedPeriods = Array.from(periods.entries()).sort((a, b) => {
      // Extract years
      const yearA = parseInt(a[0].match(/\d{4}/)[0]);
      const yearB = parseInt(b[0].match(/\d{4}/)[0]);
      
      if (yearA !== yearB) return yearA - yearB;
      
      // Extract quarters if present
      const quarterA = a[0].match(/Q(\d)/);
      const quarterB = b[0].match(/Q(\d)/);
      
      if (quarterA && quarterB) {
        return parseInt(quarterA[1]) - parseInt(quarterB[1]);
      }
      
      return 0;
    });
    
    // Function to render a batch of models
    function renderBatch(period, batchData) {
      // Display period information as overlay
      const periodInfo = document.createElement("div");
      periodInfo.style.position = "absolute";
      periodInfo.style.top = "70px";
      periodInfo.style.left = "50%";
      periodInfo.style.transform = "translateX(-50%)";
      periodInfo.style.fontSize = "24px";
      periodInfo.style.fontWeight = "bold";
      periodInfo.style.opacity = "0";
      periodInfo.style.transition = "opacity 0.5s";
      periodInfo.textContent = period;
      document.body.appendChild(periodInfo);
      
      // Fade in period info
      setTimeout(() => { periodInfo.style.opacity = "1"; }, 100);
      
      // Fade out period info after delay
      setTimeout(() => { 
        periodInfo.style.opacity = "0"; 
        setTimeout(() => { periodInfo.remove(); }, 500);
      }, 1500);
      
      // Add model circles
      self.g.selectAll(`circle.model-${period.replace(/\s+/g, '-')}`)
        .data(batchData, d => d.model)
        .enter()
        .append("circle")
        .attr("class", `model-circle model-${period.replace(/\s+/g, '-')}`)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 0)
        .attr("fill", d => self.colorScale(d.source))
        .attr("opacity", d => filters.showMMLU && d.mmlu === null ? 0.4 : 0.8)
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
          self.tooltip.transition().duration(200).style("opacity", 0.9);
          
          let mmluInfo = "";
          if (d.mmlu !== null) {
            mmluInfo = `<p>MMLU Score: ${d.mmlu}%</p>`;
          } else {
            mmluInfo = "<p>MMLU Score: Not available</p>";
          }
          
          let releaseInfo = `${d.releaseYear}`;
          if (d.releaseYear >= 2022) {
            releaseInfo = `Q${d.releaseQuarter} ${d.releaseYear}`;
          }
          
          let paramInfo = d.parameters ? `${d.parameters}B` : "Unknown";
          
          self.tooltip.html(`
            <h4>${d.model}</h4>
            <p>Provider: ${d.provider}</p>
            <p>Released: ${releaseInfo}</p>
            <p>Parameters: ${paramInfo}</p>
            <p>Source: ${d.source}</p>
            ${mmluInfo}
          `)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
          
          // Highlight the current circle
          d3.select(this)
            .attr("stroke-width", 2)
            .attr("stroke", "#000");
        })
        .on("mouseout", function() {
          self.tooltip.transition().duration(500).style("opacity", 0);
          
          // Remove highlight
          d3.select(this)
            .attr("stroke-width", 1)
            .attr("stroke", "#333");
        })
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr("r", d => d.parameters ? self.rScale(d.parameters) : self.rScale(30));
      
      // Add labels if enabled
      if (filters.showLabels) {
        self.g.selectAll(`.label-${period.replace(/\s+/g, '-')}`)
          .data(batchData, d => d.model)
          .enter()
          .append("text")
          .attr("class", `model-label label-${period.replace(/\s+/g, '-')}`)
          .attr("x", d => d.x)
          .attr("y", d => d.y + (d.parameters ? self.rScale(d.parameters) : self.rScale(30)) + 10)
          .attr("text-anchor", "middle")
          .text(d => d.model)
          .attr("opacity", 0)
          .transition()
          .delay((d, i) => i * 100 + 500)
          .duration(500)
          .attr("opacity", 1);
      }
    }
    
    // Render each period with a delay
    let delayMs = 0;
    const periodDelay = 2000; // 2 seconds between periods
    
    sortedPeriods.forEach(([period, models], i) => {
      setTimeout(() => renderBatch(period, models), delayMs);
      delayMs += periodDelay;
    });
    
    // After initial render is complete, set flag to false
    setTimeout(() => {
      this.isInitialRender = false;
    }, delayMs + periodDelay);
  },
  
  // Reset the visualization for a new animation
  reset: function() {    
    // Reset initial render flag
    this.isInitialRender = true;

    // Use the dynamic timeline reset
    if (this.dynamicTimeline) {
      this.dynamicTimeline.reset(this.latestData, this.latestFilters);
    } else {
      // Fallback to original reset behavior
      this.g.selectAll("circle.model-circle").remove();
      this.g.selectAll(".model-label").remove();
    }
  },


  setLatestData: function(data, filters) {
    this.latestData = data;
    this.latestFilters = filters;
  },

  // New method for time-based animated visualization
  renderTimeBasedAnimation: function(data, filters) {
    const self = this;
    
    // Function to clear the visualization
    const clearVisualization = () => {
      this.g.selectAll("circle.model-circle").remove();
      this.g.selectAll(".model-label").remove();
      this.g.selectAll(".time-period-label").remove();
    };
    
    // Group data by time periods
    const timelinePeriods = [
      { name: "Early Period (2017-2020)", start: new Date(2017, 0, 1), end: new Date(2020, 11, 31), duration: 3000 },
      { name: "Scaling Period (2021)", start: new Date(2021, 0, 1), end: new Date(2021, 11, 31), duration: 3000 },
      { name: "Quarterly Detail (2022-2023)", start: new Date(2022, 0, 1), end: new Date(2023, 11, 31), duration: 6000 },
      { name: "Monthly Detail (2024-2025)", start: new Date(2024, 0, 1), end: new Date(2025, 11, 31), duration: 6000 },
      { name: "Complete Timeline", start: new Date(2017, 0, 1), end: new Date(2025, 11, 31), duration: 5000 }
    ];
    
    // Show info about the current period
    const showPeriodInfo = (period) => {
      // Clear any previous period info
      this.svg.selectAll(".period-info").remove();
      
      // Show new period info
      this.svg.append("text")
        .attr("class", "period-info")
        .attr("x", this.width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(period.name);
        
      return new Promise(resolve => setTimeout(resolve, 500)); // Short delay to show new title
    };
    
    // Function to animate a specific time period
    const animatePeriod = async (period, data) => {
      // Filter data for this time period
      const periodData = data.filter(d => 
        d.releaseDate >= period.start && d.releaseDate <= period.end
      );
      
      if (periodData.length === 0) return; // Skip if no models in this period
      
      await showPeriodInfo(period);
      
      // Update time scale for this period
      this.timeScale.domain([period.start, period.end]);
      this.formatTimeAxis();
      
      // If this is the "Complete Timeline" period, we'll just show all at once
      if (period.name === "Complete Timeline") {
        // Run simulation with updated time scale
        const simulation = d3.forceSimulation(data)
          .force("x", d3.forceX(d => this.timeScale(d.releaseDate)).strength(1))
          .force("y", d3.forceY(d => {
            if (filters.showMMLU && d.mmlu !== null) {
              return this.mmluScale(d.mmlu);
            } else {
              return this.innerHeight / 2;
            }
          }).strength(filters.showMMLU ? 1 : 0.05))
          .force("collide", d3.forceCollide(d => {
            return d.parameters ? this.rScale(d.parameters) + 2 : this.rScale(30) + 2;
          }))
          .stop();
        
        // Run the simulation
        for (let i = 0; i < 120; i++) simulation.tick();
        
        // Render all models at once
        this.g.selectAll("circle.model-circle")
          .data(data, d => d.model)
          .enter()
          .append("circle")
          .attr("class", "model-circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", 0)
          .attr("fill", d => this.colorScale(d.source))
          .attr("opacity", d => filters.showMMLU && d.mmlu === null ? 0.4 : 0.8)
          .attr("stroke", "#333")
          .attr("stroke-width", 1)
          .on("mouseover", function(event, d) {
            self.showTooltip(event, d);
            d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");
          })
          .on("mouseout", function() {
            self.tooltip.transition().duration(500).style("opacity", 0);
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#333");
          })
          .transition()
          .duration(1000)
          .attr("r", d => d.parameters ? self.rScale(d.parameters) : self.rScale(30));
        
        if (filters.showLabels) {
          this.g.selectAll(".model-label")
            .data(data, d => d.model)
            .enter()
            .append("text")
            .attr("class", "model-label")
            .attr("x", d => d.x)
            .attr("y", d => d.y + (d.parameters ? self.rScale(d.parameters) : self.rScale(30)) + 10)
            .attr("text-anchor", "middle")
            .text(d => d.model)
            .attr("opacity", 0)
            .transition()
            .delay(1000)
            .duration(500)
            .attr("opacity", 1);
        }
        
        return new Promise(resolve => setTimeout(resolve, period.duration));
      }
      
      // For other periods, show with more granular detail
      // Determine subperiods based on the current time period
      let subperiods;
      if (period.name.includes("Early Period")) {
        // Group by years
        subperiods = d3.group(periodData, d => d.releaseYear);
      } else if (period.name.includes("Scaling Period")) {
        // Group by quarters
        subperiods = d3.group(periodData, d => `Q${d.releaseQuarter} ${d.releaseYear}`);
      } else if (period.name.includes("Quarterly Detail")) {
        // Group by quarters
        subperiods = d3.group(periodData, d => `Q${d.releaseQuarter} ${d.releaseYear}`);
      } else {
        // Group by months for the most recent period
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        subperiods = d3.group(periodData, d => `${months[d.releaseMonth]} ${d.releaseYear}`);
      }
      
      // Convert to sorted array
      const sortedSubperiods = Array.from(subperiods).sort((a, b) => {
        // Extract years
        const yearA = a[0].match(/\d{4}/) ? parseInt(a[0].match(/\d{4}/)[0]) : 0;
        const yearB = b[0].match(/\d{4}/) ? parseInt(b[0].match(/\d{4}/)[0]) : 0;
        
        if (yearA !== yearB) return yearA - yearB;
        
        // If years are the same, compare quarters or months
        if (a[0].includes("Q") && b[0].includes("Q")) {
          return parseInt(a[0].match(/Q(\d)/)[1]) - parseInt(b[0].match(/Q(\d)/)[1]);
        }
        
        // For months, compare month index
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 0; i < months.length; i++) {
          if (a[0].includes(months[i])) return -1;
          if (b[0].includes(months[i])) return 1;
        }
        
        return 0;
      });
      
      // Calculate the total duration for this period, divided among subperiods
      const subperiodDuration = period.duration / sortedSubperiods.length;
      
      // Run a simulation for all models in this period at once
      const simulation = d3.forceSimulation(periodData)
        .force("x", d3.forceX(d => this.timeScale(d.releaseDate)).strength(1))
        .force("y", d3.forceY(d => {
          if (filters.showMMLU && d.mmlu !== null) {
            return this.mmluScale(d.mmlu);
          } else {
            return this.innerHeight / 2;
          }
        }).strength(filters.showMMLU ? 1 : 0.05))
        .force("collide", d3.forceCollide(d => {
          return d.parameters ? this.rScale(d.parameters) + 2 : this.rScale(30) + 2;
        }))
        .stop();
      
      // Run the simulation
      for (let i = 0; i < 120; i++) simulation.tick();
      
      // Animate each subperiod
      for (const [subperiod, models] of sortedSubperiods) {
        // Show subperiod label
        this.g.append("text")
          .attr("class", "time-period-label")
          .attr("x", this.innerWidth / 2)
          .attr("y", this.innerHeight - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .text(subperiod)
          .attr("opacity", 0)
          .transition()
          .duration(300)
          .attr("opacity", 1);
        
        // Render models for this subperiod
        this.g.selectAll(`circle.model-${subperiod.replace(/\s+/g, '-')}`)
          .data(models, d => d.model)
          .enter()
          .append("circle")
          .attr("class", `model-circle model-${subperiod.replace(/\s+/g, '-')}`)
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", 0)
          .attr("fill", d => this.colorScale(d.source))
          .attr("opacity", d => filters.showMMLU && d.mmlu === null ? 0.4 : 0.8)
          .attr("stroke", "#333")
          .attr("stroke-width", 1)
          .on("mouseover", function(event, d) {
            self.showTooltip(event, d);
            d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");
          })
          .on("mouseout", function() {
            self.tooltip.transition().duration(500).style("opacity", 0);
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#333");
          })
          .transition()
          .duration(500)
          .attr("r", d => d.parameters ? self.rScale(d.parameters) : self.rScale(30));
        
        if (filters.showLabels) {
          this.g.selectAll(`.label-${subperiod.replace(/\s+/g, '-')}`)
            .data(models, d => d.model)
            .enter()
            .append("text")
            .attr("class", `model-label label-${subperiod.replace(/\s+/g, '-')}`)
            .attr("x", d => d.x)
            .attr("y", d => d.y + (d.parameters ? self.rScale(d.parameters) : self.rScale(30)) + 10)
            .attr("text-anchor", "middle")
            .text(d => d.model)
            .attr("opacity", 0)
            .transition()
            .delay(500)
            .duration(500)
            .attr("opacity", 1);
        }
        
        // Wait for the subperiod animation duration
        await new Promise(resolve => setTimeout(resolve, subperiodDuration));
      }
    };
    
    // Main animation sequence
    const runAnimation = async () => {
      clearVisualization();
      
      for (const period of timelinePeriods) {
        await animatePeriod(period, data);
        clearVisualization();
      }
      
      // After the animation completes, set the initial render flag to false
      this.isInitialRender = false;
    };
    
    // Start the animation sequence
    runAnimation();
  },

  // Helper function for tooltips (to avoid duplicating code)
  showTooltip: function(event, d) {
    this.tooltip.transition().duration(200).style("opacity", 0.9);
    
    let mmluInfo = "";
    if (d.mmlu !== null) {
      mmluInfo = `<p>MMLU Score: ${d.mmlu}%</p>`;
    } else {
      mmluInfo = "<p>MMLU Score: Not available</p>";
    }
    
    let releaseInfo = `${d.releaseYear}`;
    if (d.releaseYear >= 2022) {
      releaseInfo = `Q${d.releaseQuarter} ${d.releaseYear}`;
    }
    
    let paramInfo = d.parameters ? `${d.parameters}B` : "Unknown";
    
    this.tooltip.html(`
      <h4>${d.model}</h4>
      <p>Provider: ${d.provider}</p>
      <p>Released: ${releaseInfo}</p>
      <p>Parameters: ${paramInfo}</p>
      <p>Source: ${d.source}</p>
      ${mmluInfo}
    `)
    .style("left", (event.pageX + 5) + "px")
    .style("top", (event.pageY - 28) + "px");
  }
};