// animation-controls.js - Adds playback controls and progress bar for the animation

const AnimationControls = {
  // Configuration
  config: {
    controlsId: "timeline-controls",
    progressContainerId: "progress-container",
    progressBarId: "progress-bar",
    buttonSize: "30px"
  },
  
  // State
  isPlaying: true,
  currentPeriodIndex: 0,
  totalPeriods: 0,
  periodsWithModels: [],
  animationTimeouts: [],
  
  // Reference to DynamicTimeline
  timeline: null,
  
  // Initialize the controls
  initialize: function(timeline, totalPeriods) {
    this.timeline = timeline;
    this.totalPeriods = totalPeriods;
    this.periodsWithModels = [];
    this.animationTimeouts = [];
    this.isPlaying = true;
    this.currentPeriodIndex = 0;
    
    // Create the UI elements
    this.createControlElements();
    
    return this;
  },
  
  // Create the control elements
  createControlElements: function() {
    // Remove any existing controls
    d3.select(`#${this.config.controlsId}`).remove();
    d3.select(`#${this.config.progressContainerId}`).remove();
    
    // Get the container directly
    const container = document.getElementById("timeline-controls-container");
    
    // Clear the container
    if (container) {
      container.innerHTML = '';
    
      // Create progress bar
      const progressContainer = document.createElement("div");
      progressContainer.id = this.config.progressContainerId;
      progressContainer.className = "progress-container";
      container.appendChild(progressContainer);
      
      const progressBar = document.createElement("div");
      progressBar.id = this.config.progressBarId;
      progressBar.className = "progress-bar";
      progressContainer.appendChild(progressBar);
      
      // Create controls container
      const controls = document.createElement("div");
      controls.id = this.config.controlsId;
      controls.className = "timeline-controls";
      container.appendChild(controls);
      
      // Previous button
      const prevBtn = document.createElement("button");
      prevBtn.id = "prev-period-btn";
      prevBtn.title = "Previous Period";
      prevBtn.innerHTML = "&#10094;"; // Left arrow
      prevBtn.onclick = () => this.previousPeriod();
      controls.appendChild(prevBtn);
      
      // Play/Pause button
      const playPauseBtn = document.createElement("button");
      playPauseBtn.id = "play-pause-btn";
      playPauseBtn.title = "Pause";
      playPauseBtn.innerHTML = "&#10074;&#10074;"; // Pause symbol
      playPauseBtn.onclick = () => this.togglePlayPause();
      controls.appendChild(playPauseBtn);
      
      // Next button
      const nextBtn = document.createElement("button");
      nextBtn.id = "next-period-btn";
      nextBtn.title = "Next Period";
      nextBtn.innerHTML = "&#10095;"; // Right arrow
      nextBtn.onclick = () => this.nextPeriod();
      controls.appendChild(nextBtn);
      
      // Fast-forward button
      const ffBtn = document.createElement("button");
      ffBtn.id = "fast-forward-btn";
      ffBtn.title = "Skip to End";
      ffBtn.innerHTML = "&#10095;&#10095;"; // Double right arrow
      ffBtn.onclick = () => this.skipToEnd();
      controls.appendChild(ffBtn);
    }
  },
  
  // Update progress bar
  updateProgress: function(periodIndex) {
    this.currentPeriodIndex = periodIndex;
    const progress = (periodIndex / this.totalPeriods) * 100;
    
    d3.select(`#${this.config.progressBarId}`)
      .style("width", `${progress}%`);
  },
  
  // Store animation timeout ID for later cancellation if needed
  registerTimeout: function(timeoutId) {
    this.animationTimeouts.push(timeoutId);
  },
  
  // Clear all scheduled timeouts
  clearTimeouts: function() {
    this.animationTimeouts.forEach(id => clearTimeout(id));
    this.animationTimeouts = [];
  },
  
  // Toggle play/pause state
  togglePlayPause: function() {
    this.isPlaying = !this.isPlaying;
    
    const playPauseBtn = d3.select("#play-pause-btn");
    
    if (this.isPlaying) {
      playPauseBtn.html("&#10074;&#10074;") // Pause symbol
        .attr("title", "Pause");
      
      // Resume animation from current position
      this.timeline.resumeFromPeriod(this.currentPeriodIndex);
    } else {
      playPauseBtn.html("&#9658;") // Play symbol
        .attr("title", "Play");
      
      // Pause animation by clearing all scheduled timeouts
      this.clearTimeouts();
    }
  },
  
  // Go to previous period
  previousPeriod: function() {
    if (this.currentPeriodIndex > 0) {
      // Clear existing timeouts
      this.clearTimeouts();
      
      // Switch to previous period
      this.currentPeriodIndex--;
      
      // If paused, just update the visualization
      if (!this.isPlaying) {
        this.timeline.showPeriod(this.currentPeriodIndex);
        this.updateProgress(this.currentPeriodIndex);
      } else {
        // If playing, resume from the previous period
        this.timeline.resumeFromPeriod(this.currentPeriodIndex);
      }
    }
  },
  
  // Go to next period
  nextPeriod: function() {
    if (this.currentPeriodIndex < this.totalPeriods - 1) {
      // Clear existing timeouts
      this.clearTimeouts();
      
      // Switch to next period
      this.currentPeriodIndex++;
      
      // If paused, just update the visualization
      if (!this.isPlaying) {
        this.timeline.showPeriod(this.currentPeriodIndex);
        this.updateProgress(this.currentPeriodIndex);
      } else {
        // If playing, resume from the next period
        this.timeline.resumeFromPeriod(this.currentPeriodIndex);
      }
    }
  },
  
  // Skip to end of animation
  skipToEnd: function() {
    // Clear existing timeouts
    this.clearTimeouts();
    
    // Set the current period to the last one
    this.currentPeriodIndex = this.totalPeriods - 1;
    
    // Show the final period
    this.timeline.showPeriod(this.currentPeriodIndex);
    this.updateProgress(this.currentPeriodIndex);
    
    // Update play/pause button
    d3.select("#play-pause-btn")
      .html("&#9658;") // Play symbol
      .attr("title", "Play");
      
    this.isPlaying = false;
  }
};