// ui.js - Handles UI interactions and filter management

const UI = {
    // Current filter state - Labels OFF by default to reduce clutter
    filters: {
      showOpen: true,
      showClosed: true,
      showSmall: true,
      showMedium: true,
      showLarge: true,
      showXLarge: true,
      showLabels: false,  // OFF by default to reduce clutter
      showMMLU: true,
      selectedProviders: []
    },

    // Top providers to show individually (others grouped as "Other")
    topProviders: [
      "OpenAI", "Anthropic", "Google", "Google DeepMind", "Meta", "Meta AI",
      "Microsoft", "Mistral", "Mistral AI", "xAI", "Cohere", "DeepSeek",
      "Alibaba", "Baidu", "Hugging Face", "Stability AI", "IBM"
    ],
    
    // Initialize UI elements and event listeners
    initialize: function() {
      // Set up filter change listeners
      document.getElementById("openSource").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("closedSource").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("sizeSmall").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("sizeMedium").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("sizeLarge").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("sizeXLarge").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("showLabels").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("showMMLU").addEventListener("change", this.handleFilterChange.bind(this));
      document.getElementById("allProviders").addEventListener("change", this.handleAllProvidersChange.bind(this));
      
      // Set up restart button
      document.getElementById("restartBtn").addEventListener("click", this.handleRestart.bind(this));
      
      return this;
    },
    
    // Handle filter changes
    handleFilterChange: function() {
      // Update filter state from UI
      this.filters.showOpen = document.getElementById("openSource").checked;
      this.filters.showClosed = document.getElementById("closedSource").checked;
      this.filters.showSmall = document.getElementById("sizeSmall").checked;
      this.filters.showMedium = document.getElementById("sizeMedium").checked;
      this.filters.showLarge = document.getElementById("sizeLarge").checked;
      this.filters.showXLarge = document.getElementById("sizeXLarge").checked;
      this.filters.showLabels = document.getElementById("showLabels").checked;
      this.filters.showMMLU = document.getElementById("showMMLU").checked;
      
      // Get selected providers
      this.updateSelectedProviders();
      
      // Trigger update callback if defined
      if (typeof this.onFilterChange === 'function') {
        this.onFilterChange(this.filters);
      }
    },
    
    // Handle "All Providers" checkbox change
    handleAllProvidersChange: function() {
      const allProvidersChecked = document.getElementById("allProviders").checked;
      
      // Update all provider checkboxes
      document.querySelectorAll("#providerFilters input:not(#allProviders)").forEach(checkbox => {
        checkbox.checked = allProvidersChecked;
      });
      
      // Update selected providers
      this.updateSelectedProviders();
      
      // Trigger update callback
      if (typeof this.onFilterChange === 'function') {
        this.onFilterChange(this.filters);
      }
    },
    
    // Handle restart button click
    handleRestart: function() {
      if (typeof this.onRestart === 'function') {
        this.onRestart();
      }
    },
    
    // Update the selected providers based on checkboxes
    updateSelectedProviders: function() {
      this.filters.selectedProviders = [];
      
      document.querySelectorAll("#providerFilters input:not(#allProviders)").forEach(checkbox => {
        if (checkbox.checked) {
          this.filters.selectedProviders.push(checkbox.value);
        }
      });
    },
    
    // Populate provider filters - simplified with top providers + "Other"
    populateProviderFilters: function(providers) {
      const container = document.getElementById("providerFilters");

      // Clear existing provider checkboxes (except "All Providers")
      const allProvidersCheckbox = document.getElementById("allProviders");
      container.innerHTML = '';
      container.appendChild(allProvidersCheckbox.parentNode.cloneNode(true));

      // Re-add event listener to the new "All Providers" checkbox
      document.getElementById("allProviders").addEventListener("change", this.handleAllProvidersChange.bind(this));

      // Separate top providers and others
      const topProvidersInData = [];
      const otherProviders = [];

      providers.forEach(provider => {
        const isTop = this.topProviders.some(top =>
          provider.toLowerCase().includes(top.toLowerCase()) ||
          top.toLowerCase().includes(provider.toLowerCase())
        );
        if (isTop) {
          topProvidersInData.push(provider);
        } else {
          otherProviders.push(provider);
        }
      });

      // Sort top providers alphabetically
      topProvidersInData.sort();

      // Add checkboxes for top providers
      topProvidersInData.forEach(provider => {
        this.addProviderCheckbox(container, provider, providers);
      });

      // Add "Other" checkbox that controls all other providers
      if (otherProviders.length > 0) {
        const otherLabel = document.createElement("label");
        otherLabel.style.fontWeight = "bold";
        otherLabel.style.marginTop = "5px";
        otherLabel.style.display = "block";
        otherLabel.style.borderTop = "1px solid #ddd";
        otherLabel.style.paddingTop = "5px";

        const otherCheckbox = document.createElement("input");
        otherCheckbox.type = "checkbox";
        otherCheckbox.id = "provider-other";
        otherCheckbox.checked = true;
        otherCheckbox.dataset.otherProviders = JSON.stringify(otherProviders);

        otherCheckbox.addEventListener("change", () => {
          if (!otherCheckbox.checked) {
            document.getElementById("allProviders").checked = false;
          }
          this.handleFilterChange();
        });

        otherLabel.appendChild(otherCheckbox);
        otherLabel.appendChild(document.createTextNode(` Other (${otherProviders.length} providers)`));
        container.appendChild(otherLabel);
      }

      // Update selected providers
      this.updateSelectedProviders();
    },

    // Helper to add a provider checkbox
    addProviderCheckbox: function(container, provider, allProviders) {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `provider-${provider.replace(/\s+/g, '-').toLowerCase()}`;
      checkbox.value = provider;
      checkbox.checked = true;

      checkbox.addEventListener("change", () => {
        // Uncheck "All Providers" if any provider is unchecked
        if (!checkbox.checked) {
          document.getElementById("allProviders").checked = false;
        }

        // Check if all providers are checked
        const allChecked = Array.from(allProviders).every(p => {
          const cb = document.getElementById(`provider-${p.replace(/\s+/g, '-').toLowerCase()}`);
          return cb && cb.checked;
        });

        if (allChecked) {
          document.getElementById("allProviders").checked = true;
        }

        this.handleFilterChange();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${provider}`));
      container.appendChild(label);
    },

    // Update selected providers - now handles "Other" group
    updateSelectedProviders: function() {
      this.filters.selectedProviders = [];

      // Add individually checked providers
      document.querySelectorAll("#providerFilters input:not(#allProviders):not(#provider-other)").forEach(checkbox => {
        if (checkbox.checked) {
          this.filters.selectedProviders.push(checkbox.value);
        }
      });

      // Add "Other" providers if that checkbox is checked
      const otherCheckbox = document.getElementById("provider-other");
      if (otherCheckbox && otherCheckbox.checked) {
        const otherProviders = JSON.parse(otherCheckbox.dataset.otherProviders || "[]");
        this.filters.selectedProviders.push(...otherProviders);
      }
    }
  };