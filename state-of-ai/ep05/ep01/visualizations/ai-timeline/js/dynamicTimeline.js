// dynamicTimeline.js - Enhanced timeline visualization with dynamic zooming

const DynamicTimeline = {
  // Configuration options
  config: {
    // Animation timing
    initialDelay: 1000,         // Delay before starting animation
    modelEntryDuration: 500,    // Duration for each model to appear
    zoomTransitionDuration: 1500, // Duration of zoom transitions
    
    // Significant models configuration
    significantModels: [
      "GPT-4", "GPT-4o", "GPT-4 Turbo", "GPT-3", "ChatGPT", 
      "Claude 3.5 Sonnet", "Claude 2", "Claude 2.1", "Claude 3 Opus", 
      "Gemini Ultra", "Gemini 1.5 Pro", "Gemini 1.5", "Gemini 1.5 Flash",
      "LLaMA 2", "LLaMA 3", "LLaMA 3.1", "Mistral 7B", "Mistral Small",
      "Mixtral-8x7B", "Mixtral-8B", "Falcon", "Grok-1", "Grok-2",
      "PaLM", "Chinchilla", "Galactica", "BLOOM", "Yi", "Qwen",
      "BLOOMZ", "BloombergGPT", "DBRX", "DeepSeek", "Watson", "CyberTron"
    ],
    
    // Significant providers
    significantProviders: [
      "OpenAI", "Anthropic", "Google", "Meta", "Microsoft", "Mistral AI", 
      "Cohere", "Inflection", "xAI", "Baidu", "DeepMind", "IBM", 
      "Bloomberg", "Chinese", "other"
    ],
    
    // Time periods for zooming effect - renamed for "Speed of AI" narrative
    timePeriods: [
      {
        name: "The Research Era",
        subtitle: "Foundations laid (2017-2020)",
        start: new Date(2017, 0, 1),
        end: new Date(2020, 11, 31),
        timeUnit: "year",
        tickFormat: d3.timeFormat("%Y")
      },
      {
        name: "The Scaling Era",
        subtitle: "Bigger is better (2021-2022)",
        start: new Date(2021, 0, 1),
        end: new Date(2022, 11, 31),
        timeUnit: "quarter",
        tickFormat: d => {
          const quarter = Math.floor(d.getMonth() / 3) + 1;
          return `Q${quarter} ${d.getFullYear()}`;
        }
      },
      {
        name: "The Cambrian Explosion",
        subtitle: "Post-ChatGPT flood (2023-2025)",
        start: new Date(2023, 0, 1),
        end: new Date(2025, 11, 31),
        timeUnit: "month",
        tickFormat: d3.timeFormat("%b %Y")
      },
      {
        name: "The Full Picture",
        subtitle: "8 years of exponential growth",
        start: new Date(2017, 0, 1),
        end: new Date(2025, 11, 31),
        timeUnit: "mixed",
        tickFormat: d => {
          const year = d.getFullYear();
          if (year < 2021) {
            return year.toString();
          } else if (year < 2023) {
            const quarter = Math.floor(d.getMonth() / 3) + 1;
            return `Q${quarter} ${year}`;
          } else {
            return d3.timeFormat("%b %Y")(d);
          }
        }
      }
    ],
    
    // Provider colors (matching the example image)
    providerColors: {
      "Anthropic": "#c73432", // Red
      "OpenAI": "#9467bd",    // Purple
      "Google": "#f1c232",    // Yellow
      "Meta": "#6aa84f",      // Green
      "Microsoft": "#2e6c8a", // Teal
      "Mistral AI": "#3d64c9", // Blue
      "Chinese": "#e69138",   // Orange
      "other": "#db7093",     // Pink
      "IBM": "#4169e1",       // Royal Blue
      "default": "#808080"    // Gray for others
    }
  },
  
  // Reference to parent visualizer
  visualizer: null,
  
  // Current state
  currentPeriodIndex: 0,
  isShowingSignificantOnly: true,  // ON by default to reduce clutter
  
  // Initialization
  initialize: function(visualizer) {
    this.visualizer = visualizer;
    return this;
  },
  
  // Start the dynamic timeline animation
  startAnimation: function(data, filters) {
    const self = this;
    this.isShowingSignificantOnly = false;
    
    // Find the earliest model date
    const sortedByDate = [...data].sort((a, b) => a.releaseDate - b.releaseDate);
    const earliestDate = sortedByDate.length > 0 ? sortedByDate[0].releaseDate : new Date(2017, 0, 1);
    
    // Adjust the first period start date to match the earliest model
    this.config.timePeriods[0].start = new Date(
      Math.max(2017, earliestDate.getFullYear() - 1), 
      0, 
      1
    );
    
    // Create container for period title
    this.visualizer.svg.selectAll(".period-title").remove();
    this.visualizer.svg.append("text")
      .attr("class", "period-title")
      .attr("x", this.visualizer.width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text("");
    
    // Add "Show Significant Models Only" toggle
    this.addSignificantModelsToggle();
    
    // Start the animation sequence
    setTimeout(() => {
      this.animatePeriod(0, data, filters);
    }, this.config.initialDelay);
  },
  
  // Add toggle for significant models
  addSignificantModelsToggle: function() {
    const self = this;
    
    // Remove any existing toggle
    d3.select("#significant-toggle-container").remove();
    
    // Create toggle container
    const toggleContainer = d3.select("body")
      .append("div")
      .attr("id", "significant-toggle-container")
      .style("position", "absolute")
      .style("top", "15px")
      .style("right", "15px")
      .style("background-color", "#f9f9f9")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("border", "1px solid #ddd");
    
    // Add search box
    toggleContainer.append("input")
      .attr("type", "text")
      .attr("id", "model-search")
      .attr("placeholder", "search...")
      .style("margin-right", "10px")
      .style("padding", "2px 5px")
      .style("border-radius", "3px")
      .style("border", "1px solid #ccc")
      .on("input", function() {
        // Implement search functionality
        const searchTerm = this.value.toLowerCase();
        self.visualizer.g.selectAll("circle.model-circle")
          .style("opacity", d => {
            if (searchTerm === "") return self.isShowingSignificantOnly ? 
              (self.isModelSignificant(d) ? 0.8 : 0.2) : 0.8;
            return d.model.toLowerCase().includes(searchTerm) ? 0.8 : 0.1;
          });
      });
    
    // Add toggle button
    toggleContainer.append("span")
      .text("show only: ")
      .style("margin-right", "5px");
      
    toggleContainer.append("button")
      .attr("id", "significant-toggle")
      .text("significant models")
      .style("background-color", self.isShowingSignificantOnly ? "#4285F4" : "#f1f1f1")
      .style("color", self.isShowingSignificantOnly ? "white" : "black")
      .style("border", "1px solid #ccc")
      .style("border-radius", "3px")
      .style("padding", "2px 8px")
      .style("cursor", "pointer")
      .on("click", function() {
        self.isShowingSignificantOnly = !self.isShowingSignificantOnly;
        
        // Update button appearance
        d3.select(this)
          .style("background-color", self.isShowingSignificantOnly ? "#4285F4" : "#f1f1f1")
          .style("color", self.isShowingSignificantOnly ? "white" : "black");
        
        // Filter the visualization
        self.visualizer.g.selectAll("circle.model-circle")
          .transition()
          .duration(500)
          .style("opacity", d => self.isShowingSignificantOnly ? 
            (self.isModelSignificant(d) ? 0.8 : 0.2) : 0.8);
        
        // Update labels visibility
        self.visualizer.g.selectAll(".model-label")
          .transition()
          .duration(500)
          .style("opacity", d => self.isShowingSignificantOnly ? 
            (self.isModelSignificant(d) ? 1 : 0) : 1);
      });
  },
  
  // Check if a model is in the significant list
  isModelSignificant: function(d) {
    // Check if the model name contains any of the significant model names
    return this.config.significantModels.some(name => 
      d.model.toLowerCase().includes(name.toLowerCase())
    ) || 
    // Or if the provider is in the significant providers list
    this.config.significantProviders.some(provider => 
      d.provider.toLowerCase().includes(provider.toLowerCase())
    );
  },
  
  // Get color based on provider
  getProviderColor: function(provider) {
    if (!provider) return this.config.providerColors.default;
    
    // Check each significant provider
    for (const [key, color] of Object.entries(this.config.providerColors)) {
      if (provider.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    
    // Check for IBM
    if (provider.toLowerCase().includes("ibm") || 
        provider.toLowerCase().includes("watson")) {
      return this.config.providerColors.IBM;
    }
    
    // Check for Chinese providers
    if (provider.toLowerCase().includes("baidu") || 
        provider.toLowerCase().includes("alibaba") ||
        provider.toLowerCase().includes("tencent") ||
        provider.toLowerCase().includes("huawei") ||
        provider.toLowerCase().includes("zhipu") ||
        provider.toLowerCase().includes("bytedance")) {
      return this.config.providerColors.Chinese;
    }
    
    return this.config.providerColors.other;
  },
  
  // Animate a specific time period
  animatePeriod: function(periodIndex, data, filters) {
    // Update the animation controls progress
    this.visualizer.animationControls.updateProgress(periodIndex);

    if (periodIndex >= this.config.timePeriods.length) {
      // Animation complete
      this.visualizer.isInitialRender = false;
      return;
    }
    
    const self = this;
    const period = this.config.timePeriods[periodIndex];
    this.currentPeriodIndex = periodIndex;

    // Update period title with subtitle
    this.visualizer.svg.select(".period-title")
      .text(period.name);

    // Add/update subtitle if it exists
    this.visualizer.svg.selectAll(".period-subtitle").remove();
    if (period.subtitle) {
      this.visualizer.svg.append("text")
        .attr("class", "period-subtitle")
        .attr("x", this.visualizer.width / 2)
        .attr("y", 48)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#666")
        .text(period.subtitle);
    }

    // Filter data for this time period (but include all data for final period)
    const periodData = periodIndex === this.config.timePeriods.length - 1 ?
      data :
      data.filter(d => d.releaseDate >= period.start && d.releaseDate <= period.end);
    
    // Update the time scale
    this.visualizer.timeScale.domain([period.start, period.end]);
    
    // Create ticks based on the time unit
    let tickValues = [];
    if (period.timeUnit === "year") {
      // Yearly ticks
      const startYear = period.start.getFullYear();
      const endYear = period.end.getFullYear();
      for (let year = startYear; year <= endYear; year++) {
        tickValues.push(new Date(year, 0, 1));
      }
    } else if (period.timeUnit === "quarter") {
      // Quarterly ticks
      const startYear = period.start.getFullYear();
      const endYear = period.end.getFullYear();
      for (let year = startYear; year <= endYear; year++) {
        for (let quarter = 0; quarter < 4; quarter++) {
          const date = new Date(year, quarter * 3, 1);
          if (date >= period.start && date <= period.end) {
            tickValues.push(date);
          }
        }
      }
    } else if (period.timeUnit === "month") {
      // Monthly ticks
      const startYear = period.start.getFullYear();
      const startMonth = period.start.getMonth();
      const endYear = period.end.getFullYear();
      const endMonth = period.end.getMonth();
      
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = (year === startYear) ? startMonth : 0;
        const monthEnd = (year === endYear) ? endMonth : 11;
        
        for (let month = monthStart; month <= monthEnd; month++) {
          if (month % 3 === 0) { // Every 3 months to avoid overcrowding
            tickValues.push(new Date(year, month, 1));
          }
        }
      }
    } else if (period.timeUnit === "mixed") {
      // Mixed ticks for full timeline
      // Years for 2017-2020
      for (let year = 2017; year <= 2020; year++) {
        tickValues.push(new Date(year, 0, 1));
      }
      
      // Quarters for 2021-2022
      for (let year = 2021; year <= 2022; year++) {
        for (let quarter = 0; quarter < 4; quarter++) {
          tickValues.push(new Date(year, quarter * 3, 1));
        }
      }
      
      // Bi-monthly for 2023-2025
      for (let year = 2023; year <= 2025; year++) {
        for (let month = 0; month < 12; month += 2) {
          tickValues.push(new Date(year, month, 1));
        }
      }
    }
    
    // Update the axis with the custom ticks
    this.visualizer.xAxis.transition()
      .duration(this.config.zoomTransitionDuration)
      .call(
        d3.axisBottom(this.visualizer.timeScale)
          .tickValues(tickValues)
          .tickFormat(period.tickFormat)
      )
      .selectAll("text")
      .attr("y", 10)
      .attr("x", -5)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    
    // Run a force simulation to position the models
    const simulation = d3.forceSimulation(periodData)
      .force("x", d3.forceX(d => this.visualizer.timeScale(d.releaseDate)).strength(1))
      .force("y", d3.forceY(d => {
        if (filters.showMMLU && d.mmlu !== null) {
          return this.visualizer.mmluScale(d.mmlu);
        } else {
          return this.visualizer.innerHeight / 2;
        }
      }).strength(filters.showMMLU ? 1 : 0.05))
      .force("collide", d3.forceCollide(d => {
        return d.parameters ? this.visualizer.rScale(d.parameters) + 2 : this.visualizer.rScale(30) + 2;
      }))
      .stop();
    
    // Run the simulation
    for (let i = 0; i < 120; i++) simulation.tick();
    
    // Clear any existing circles and labels
    this.visualizer.g.selectAll("circle.model-circle").remove();
    this.visualizer.g.selectAll(".model-label").remove();
    
    // Add models chronologically
    periodData.sort((a, b) => a.releaseDate - b.releaseDate);
    
    // Update color scale to use provider-based colors
    const providerColorScale = d => this.getProviderColor(d.provider);
    
    // Animate each model entry
    periodData.forEach((d, i) => {
      setTimeout(() => {
        // Add the circle
        const circle = this.visualizer.g.append("circle")
          .datum(d)
          .attr("class", "model-circle")
          .attr("cx", d.x)
          .attr("cy", d.y)
          .attr("r", 0)
          .attr("fill", providerColorScale(d))
          .attr("stroke", "#333")
          .attr("stroke-width", 1)
          .style("opacity", this.isShowingSignificantOnly ? 
            (this.isModelSignificant(d) ? 0.8 : 0.2) : 0.8)
          .on("mouseover", function(event, d) {
            self.visualizer.showTooltip(event, d);
            d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");
          })
          .on("mouseout", function() {
            self.visualizer.tooltip.transition().duration(500).style("opacity", 0);
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#333");
          });
          
        circle.transition()
          .duration(this.config.modelEntryDuration)
          .attr("r", d => d.parameters ? 
            this.visualizer.rScale(d.parameters) : this.visualizer.rScale(30));
        
        // Add the label if enabled
        if (filters.showLabels) {
          this.visualizer.g.append("text")
            .datum(d)
            .attr("class", "model-label")
            .attr("x", d.x)
            .attr("y", d => d.y + (d.parameters ? 
              this.visualizer.rScale(d.parameters) : this.visualizer.rScale(30)) + 10)
            .attr("text-anchor", "middle")
            .text(d.model)
            .style("opacity", this.isShowingSignificantOnly ? 
              (this.isModelSignificant(d) ? 1 : 0) : 0)
            .transition()
            .delay(this.config.modelEntryDuration)
            .duration(500)
            .style("opacity", this.isShowingSignificantOnly ? 
              (this.isModelSignificant(d) ? 1 : 0) : 1);
        }
      }, i * (this.config.modelEntryDuration / 5)); // Divide by 5 to speed up the animation
    });
    
    // Move to the next period after all models are shown
    const totalDuration = periodData.length * (this.config.modelEntryDuration / 5) + 
                          this.config.zoomTransitionDuration;
                          
    const timeoutId = setTimeout(() => {
      this.animatePeriod(periodIndex + 1, data, filters);
    }, totalDuration + 1000);

    // Register the timeout with the animation controls
    this.visualizer.animationControls.registerTimeout(timeoutId);
  },
  
  // Add provider legend to match the second image
  addProviderLegend: function() {
    // Remove any existing legend
    this.visualizer.svg.selectAll(".provider-legend").remove();
    
    const legendContainer = this.visualizer.svg.append("g")
      .attr("class", "provider-legend")
      .attr("transform", `translate(20, 20)`);
    
    // Get significant providers
    const providers = Object.entries(this.config.providerColors)
      .filter(([key, _]) => key !== "default");
    
    // Create legend entries
    providers.forEach(([provider, color], i) => {
      if (provider === "default") return;
      
      const legendItem = legendContainer.append("g")
        .attr("transform", `translate(${(i % 8) * 120}, ${Math.floor(i / 8) * 25})`);
      
      legendItem.append("circle")
        .attr("r", 6)
        .attr("fill", color);
        
      legendItem.append("text")
        .attr("x", 12)
        .attr("y", 4)
        .text(provider)
        .style("font-size", "12px");
    });
  },
  
  // Reset and restart the animation
  reset: function(data, filters) {
    this.currentPeriodIndex = 0;
    this.isShowingSignificantOnly = false;
    
    // Clear visualizations
    this.visualizer.g.selectAll("circle.model-circle").remove();
    this.visualizer.g.selectAll(".model-label").remove();
    
    // Reset toggle button if it exists
    const toggleButton = d3.select("#significant-toggle");
    if (!toggleButton.empty()) {
      toggleButton
        .style("background-color", "#f1f1f1")
        .style("color", "black");
    }
    
    // Start animation again
    this.startAnimation(data, filters);
  },

  // Resume animation from a specific period
  resumeFromPeriod: function(periodIndex) {
    if (periodIndex >= this.config.timePeriods.length) {
      // Animation complete
      this.visualizer.isInitialRender = false;
      return;
    }
    
    // Clear any existing visualization
    this.visualizer.g.selectAll("circle.model-circle").remove();
    this.visualizer.g.selectAll(".model-label").remove();
    
    // Start animating from the specified period
    this.animatePeriod(periodIndex, this.visualizer.latestData, this.visualizer.latestFilters);
  },

  // Show a specific period without animation
  showPeriod: function(periodIndex) {
    if (periodIndex >= this.config.timePeriods.length) return;
    
    const period = this.config.timePeriods[periodIndex];
    
    // Update period title
    this.visualizer.svg.select(".period-title")
      .text(period.name);
    
    // Update the time scale
    this.visualizer.timeScale.domain([period.start, period.end]);
    this.visualizer.formatTimeAxis();
    
    // Clear existing visualization
    this.visualizer.g.selectAll("circle.model-circle").remove();
    this.visualizer.g.selectAll(".model-label").remove();
    
    // Show all models for this period at once
    const periodData = periodIndex === this.config.timePeriods.length - 1 ?
      this.visualizer.latestData :
      this.visualizer.latestData.filter(d => 
        d.releaseDate >= period.start && d.releaseDate <= period.end
      );
    
    // Run a simulation for positioning
    const simulation = d3.forceSimulation(periodData)
      .force("x", d3.forceX(d => this.visualizer.timeScale(d.releaseDate)).strength(1))
      .force("y", d3.forceY(d => {
        if (this.visualizer.latestFilters.showMMLU && d.mmlu !== null) {
          return this.visualizer.mmluScale(d.mmlu);
        } else {
          return this.visualizer.innerHeight / 2;
        }
      }).strength(this.visualizer.latestFilters.showMMLU ? 1 : 0.05))
      .force("collide", d3.forceCollide(d => {
        return d.parameters ? 
          this.visualizer.rScale(d.parameters) + 2 : 
          this.visualizer.rScale(30) + 2;
      }))
      .stop();
    
    // Run the simulation
    for (let i = 0; i < 120; i++) simulation.tick();
    
    // Render all models at once
    this.renderPeriodModels(periodData, this.visualizer.latestFilters);
  }
};