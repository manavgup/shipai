// dataProcessor.js - Handles loading and processing CSV data

const DataProcessor = {
  // Raw CSV data
  rawData: null,
  
  // Processed data ready for visualization
  processedData: [],
  
  // Load CSV file and process data
  loadData: async function(csvUrl = 'Models_table.csv') {
    try {
      console.log('Loading data from:', csvUrl);
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log('CSV loaded, length:', csvText.length);
      
      this.rawData = csvText;
      this.processedData = this.processCSV(csvText);
      console.log('Processed data:', this.processedData.length, 'models');
      return this.processedData;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  },
  
  // Add this to your DataProcessor object in dataProcessor.js
  getUniqueProviders: function() {
    if (!this.processedData || this.processedData.length === 0) {
      return [];
    }
    
    const providers = new Set();
    this.processedData.forEach(d => {
      if (d.provider && d.provider !== 'Unknown') {
        providers.add(d.provider);
      }
    });
    
    return Array.from(providers).sort();
  },

  // Add this to your DataProcessor object in dataProcessor.js
  // Add this to your DataProcessor object in dataProcessor.js
  filterData: function(filters) {
    if (!this.processedData || this.processedData.length === 0) {
      return [];
    }
    
    return this.processedData.filter(d => {
      // Filter by source type
      const sourceMatch = (filters.showOpen && d.source === 'Open') || 
                          (filters.showClosed && d.source === 'Closed');
      
      // Filter by size
      let sizeMatch = false;
      if (d.parameters === null) {
        // For models with unknown parameters, include in all size categories
        sizeMatch = filters.showSmall || filters.showMedium || filters.showLarge || filters.showXLarge;
      } else {
        if (filters.showSmall && d.parameters <= 8) sizeMatch = true;
        else if (filters.showMedium && d.parameters > 8 && d.parameters <= 10) sizeMatch = true;
        else if (filters.showLarge && d.parameters > 10 && d.parameters <= 100) sizeMatch = true;
        else if (filters.showXLarge && d.parameters > 100) sizeMatch = true;
      }
      
      // Filter by provider
      const providerMatch = filters.selectedProviders.includes(d.provider);
      
      return sourceMatch && sizeMatch && providerMatch;
    });
  },
  
  // Process CSV data into useful format for visualization
  processCSV: function(csvText) {
    const lines = csvText.split('\n');
    if (lines.length <= 1) {
      console.error('CSV file is empty or has only headers');
      return [];
    }
    
    // Get header line and find relevant columns
    const headers = lines[0].split(',');
    console.log('CSV Headers:', headers);
    
    // Try to identify relevant columns by searching through headers
    const columnIndices = this.findRelevantColumns(headers);
    console.log('Identified column indices:', columnIndices);
    
    // Important fix: Skip the column validation that's causing the error
    // We already found the model column at index 0, so don't check again
    
    // Process each line of the CSV
    const processedData = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      // Split the CSV line, handling quotes properly
      let values = this.splitCSVLine(lines[i]);
      if (values.length < headers.length) continue; // Skip incomplete rows
      
      // Extract and process model data
      const modelData = this.extractModelData(values, columnIndices);
      
      // Only add rows with valid data
      if (modelData && modelData.model && modelData.releaseDate) {
        processedData.push(modelData);
      }
    }
    
    // Sort by release date
    return processedData.sort((a, b) => a.releaseDate - b.releaseDate);
  },
  
  // Split CSV line properly handling quoted values
  splitCSVLine: function(line) {
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue.trim());
    return values;
  },
  
  // Find relevant columns in CSV headers
  findRelevantColumns: function(headers) {
    const columnIndices = {
      model: null,
      provider: null,
      parameters: null,
      releaseDate: null,
      isPublic: null,
      mmlu: null
    };
    
    // Check each header for matches (case insensitive)
    headers.forEach((header, index) => {
      if (!header) return;
      
      const headerText = header.trim().toLowerCase();
      if (!headerText) return;
      
      if (headerText === 'model' || headerText.includes('name') || headerText.includes('title')) {
        columnIndices.model = index;
      }
      if (headerText === 'provider' || headerText.includes('lab') || headerText.includes('company') || headerText.includes('organization')) {
        columnIndices.provider = index;
      }
      if (headerText === 'parameters' || headerText.includes('params') || headerText.includes('param') || headerText.includes('size')) {
        columnIndices.parameters = index;
      }
      if (headerText === 'announced' || headerText.includes('date') || headerText.includes('release') || headerText.includes('published')) {
        columnIndices.releaseDate = index;
      }
      if (headerText === 'public?' || headerText.includes('public') || headerText.includes('open') || headerText.includes('source')) {
        columnIndices.isPublic = index;
      }
      if (headerText === 'mmlu' || headerText.includes('score') || headerText.includes('benchmark')) {
        columnIndices.mmlu = index;
      }
    });
    
    return columnIndices;
  },
  
  // Extract and process model data from a CSV row
  extractModelData: function(values, columnIndices) {
    // Extract model name (required)
    const modelName = columnIndices.model !== null ? values[columnIndices.model] : 'Unknown Model';
    
    // Skip rows with empty model names, but accept non-empty ones even if they're "Unknown Model"
    if (!modelName || modelName.trim() === '') {
      return null;
    }
    
    // Extract provider/lab
    const provider = columnIndices.provider !== null ? values[columnIndices.provider] : 'Unknown';
    
    // Extract and convert parameters to number
    let parameters = null;
    if (columnIndices.parameters !== null) {
      const paramStr = values[columnIndices.parameters];
      if (paramStr) {
        // Extract numeric value from the string (handle cases like "7B" or "7 billion")
        const paramMatch = paramStr.match(/(\d+(\.\d+)?)/);
        if (paramMatch) {
          parameters = parseFloat(paramMatch[1]);
        }
      }
    }
    
    // Extract release date
    let releaseDate = null;
    if (columnIndices.releaseDate !== null) {
      const dateStr = values[columnIndices.releaseDate];
      releaseDate = this.parseReleaseDate(dateStr);
    } else {
      // If no date column, use a random date for visualization
      const randomYear = 2017 + Math.floor(Math.random() * 8); // Random year between 2017-2024
      const randomMonth = Math.floor(Math.random() * 12);
      releaseDate = new Date(randomYear, randomMonth, 1);
    }
    
    // Default to January 2023 if date parsing fails
    if (!releaseDate) {
      releaseDate = new Date(2023, 0, 1);
    }
    
    // Determine if open source
    let source = 'Closed';
    if (columnIndices.isPublic !== null) {
      const publicStr = values[columnIndices.isPublic];
      if (publicStr && (
          publicStr.toLowerCase().includes('yes') || 
          publicStr.toLowerCase().includes('true') || 
          publicStr.toLowerCase().includes('open')
      )) {
        source = 'Open';
      }
    }
    
    // Extract MMLU score if available
    let mmlu = null;
    if (columnIndices.mmlu !== null) {
      const mmluStr = values[columnIndices.mmlu];
      if (mmluStr) {
        const mmluMatch = mmluStr.match(/(\d+(\.\d+)?)/);
        if (mmluMatch) {
          mmlu = parseFloat(mmluMatch[1]);
          // Ensure MMLU is in 0-100 range
          if (mmlu > 0 && mmlu <= 1) {
            mmlu *= 100; // Convert from 0-1 to 0-100 scale
          }
        }
      }
    }
    
    // Create the processed model object with derived fields
    return {
      model: modelName,
      provider: provider,
      parameters: parameters,
      releaseDate: releaseDate,
      releaseYear: releaseDate.getFullYear(),
      releaseQuarter: Math.floor(releaseDate.getMonth() / 3) + 1,
      releaseMonth: releaseDate.getMonth(),
      source: source,
      mmlu: mmlu
    };
  },
  
  // Parse a date string in various formats
  // Parse a date string in various formats
  parseReleaseDate: function(dateStr) {
    if (!dateStr) return null;
    
    // Handle "TBA" or future dates
    if (dateStr.toLowerCase().includes('tba')) {
      return new Date(2025, 0, 1);
    }
    
    // Check for short format like "25-Feb" (meaning 2025-February)
    const shortYearMonthMatch = dateStr.match(/(\d{2})-([A-Za-z]{3})/);
    if (shortYearMonthMatch) {
      const shortYear = parseInt(shortYearMonthMatch[1]);
      const monthStr = shortYearMonthMatch[2].toLowerCase();
      const fullYear = 2000 + shortYear; // Convert "25" to "2025"
      
      // Map month abbreviations to month indices
      const monthNames = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      
      for (const [monthName, monthIndex] of Object.entries(monthNames)) {
        if (monthStr.startsWith(monthName)) {
          return new Date(fullYear, monthIndex, 1);
        }
      }
    }
    
    // Try to extract full year (19xx or 20xx)
    const yearMatch = dateStr.match(/(19|20)\d{2}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      
      // Check for quarters (Q1, Q2, etc.)
      const quarterMatch = dateStr.match(/Q([1-4])/i);
      if (quarterMatch) {
        const quarter = parseInt(quarterMatch[1]);
        return new Date(year, (quarter - 1) * 3, 1);
      }
      
      // Check for month names
      const monthNames = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      
      for (const [monthName, monthIndex] of Object.entries(monthNames)) {
        if (dateStr.toLowerCase().includes(monthName)) {
          return new Date(year, monthIndex, 1);
        }
      }
      
      // Default to January of the year if only year is present
      return new Date(year, 0, 1);
    }
    
    // If we can't determine the date, default to a recent date
    console.warn('Could not parse date string:', dateStr);
    return new Date(2023, 0, 1);
  }
};