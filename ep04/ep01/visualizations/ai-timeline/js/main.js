// main.js - Main application logic and initialization

document.addEventListener("DOMContentLoaded", async function() {
  // Initialize the application
  try {
    // Show loading indicator
    const loadingEl = document.getElementById("loading");
    loadingEl.textContent = "Loading data...";
    
    // Load the data
    await DataProcessor.loadData();
    
    loadingEl.textContent = "Preparing visualization...";
    
    // Initialize the visualization
    Visualizer.initialize();
    
    // Initialize UI and set up callback
    UI.initialize();
    
    // Set UI callbacks
    UI.onFilterChange = updateVisualization;
    UI.onRestart = restartVisualization;
    
    // Populate provider filters
    const providers = DataProcessor.getUniqueProviders();
    UI.populateProviderFilters(providers);
    UI.updateSelectedProviders();
    
    // Hide loading indicator
    loadingEl.classList.add("hidden");
    
    // Initial visualization update
    updateVisualization(UI.filters);
    
  } catch (error) {
    console.error("Error initializing application:", error);
    document.getElementById("loading").textContent = 
      `Error loading data: ${error.message}. Please check the console for details.`;
  }
});

// Update the visualization based on current filters
function updateVisualization(filters) {
  // Filter the data
  const filteredData = DataProcessor.filterData(filters);
  
  // Update the visualization
  Visualizer.update(filteredData, filters);
}

// Restart the chronological animation
function restartVisualization() {
  // Reset the visualization state
  Visualizer.reset();
  
  // Update with current filters
  //updateVisualization(UI.filters);
}

// Handle errors gracefully
window.addEventListener("error", function(event) {
  console.error("Application error:", event.error);
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("loading").textContent = 
    `An error occurred: ${event.error.message}. Please check the console for details.`;
});