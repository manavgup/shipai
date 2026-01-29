// storyMode.js - Podcast-optimized visualization for "Speed of AI"
// Self-contained module with curated models, milestones, and metrics

const StoryMode = {
  // ============================================
  // CONFIGURATION
  // ============================================

  // Curated list of ~40 significant models for the narrative
  significantModels: [
    // 2017-2018: Early transformers
    "Transformer", "BERT", "GPT",
    // 2019-2020: Scaling begins
    "GPT-2", "T5", "GPT-3", "Megatron",
    // 2021: Scaling laws era
    "Codex", "DALL-E", "Gopher", "Chinchilla", "PaLM",
    // 2022: The explosion begins
    "ChatGPT", "InstructGPT", "BLOOM", "Stable Diffusion", "Whisper",
    // 2023: Rapid innovation
    "GPT-4", "Claude", "Claude 2", "LLaMA", "LLaMA 2", "Falcon",
    "Mistral", "Mixtral", "Gemini", "Gemini Ultra", "Gemini Pro",
    // 2024: Monthly releases
    "Claude 3", "Claude 3 Opus", "Claude 3.5 Sonnet", "GPT-4 Turbo", "GPT-4o",
    "LLaMA 3", "Gemini 1.5", "Mistral Large", "DBRX", "Grok",
    "Command R", "Qwen", "Yi", "DeepSeek",
    // 2025: Weekly releases
    "GPT-4.5", "Claude 3.7", "Gemini 2", "Grok-3", "LLaMA 4",
    "DeepSeek-R1", "Qwen 2.5"
  ],

  // Key milestones to highlight during animation
  milestones: [
    { date: new Date(2017, 5, 1), icon: "🎯", text: "Attention Is All You Need", subtext: "The Transformer architecture is born" },
    { date: new Date(2018, 9, 1), icon: "📚", text: "BERT Released", subtext: "Pre-training revolutionizes NLP" },
    { date: new Date(2020, 4, 1), icon: "📈", text: "GPT-3: 175B Parameters", subtext: "Scaling laws proven at scale" },
    { date: new Date(2022, 10, 30), icon: "💬", text: "ChatGPT Launches", subtext: "AI goes mainstream - 100M users in 2 months" },
    { date: new Date(2023, 2, 14), icon: "🚀", text: "GPT-4 Released", subtext: "Multimodal AI arrives" },
    { date: new Date(2023, 6, 18), icon: "🔓", text: "LLaMA 2 Open Sourced", subtext: "Open source catches up" },
    { date: new Date(2024, 2, 4), icon: "🏆", text: "Claude 3 Opus", subtext: "First to match GPT-4 on benchmarks" },
    { date: new Date(2025, 0, 27), icon: "🧠", text: "DeepSeek-R1", subtext: "Reasoning models go open source" }
  ],

  // Animation phases with better names for the narrative
  phases: [
    {
      name: "The Research Era",
      subtitle: "2017-2020 • Foundations laid",
      start: new Date(2017, 0, 1),
      end: new Date(2020, 11, 31),
      timeUnit: "year",
      tickFormat: d3.timeFormat("%Y"),
      duration: 8000
    },
    {
      name: "The Scaling Era",
      subtitle: "2021-2022 • Bigger is better",
      start: new Date(2021, 0, 1),
      end: new Date(2022, 11, 31),
      timeUnit: "quarter",
      tickFormat: d => `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`,
      duration: 10000
    },
    {
      name: "The Cambrian Explosion",
      subtitle: "2023-2024 • Post-ChatGPT flood",
      start: new Date(2023, 0, 1),
      end: new Date(2024, 11, 31),
      timeUnit: "month",
      tickFormat: d3.timeFormat("%b %Y"),
      duration: 15000
    },
    {
      name: "The Weekly Release Era",
      subtitle: "2025 • A new model every few days",
      start: new Date(2025, 0, 1),
      end: new Date(2025, 11, 31),
      timeUnit: "week",
      tickFormat: d3.timeFormat("%b %d"),
      duration: 8000
    },
    {
      name: "The Full Picture",
      subtitle: "8 years of exponential growth",
      start: new Date(2017, 0, 1),
      end: new Date(2025, 11, 31),
      timeUnit: "mixed",
      tickFormat: d => d.getFullYear() < 2023 ? d.getFullYear().toString() : d3.timeFormat("%b %Y")(d),
      duration: 5000
    }
  ],

  // Provider colors
  providerColors: {
    "OpenAI": "#9467bd",
    "Anthropic": "#c73432",
    "Google": "#f1c232",
    "DeepMind": "#f1c232",
    "Meta": "#6aa84f",
    "Microsoft": "#2e6c8a",
    "Mistral": "#3d64c9",
    "xAI": "#e69138",
    "Cohere": "#17becf",
    "DeepSeek": "#2ca02c",
    "Alibaba": "#ff7f0e",
    "Baidu": "#d62728",
    "default": "#808080"
  },

  // ============================================
  // STATE
  // ============================================
  svg: null,
  g: null,
  width: 1200,
  height: 650,
  margin: { top: 80, right: 50, bottom: 80, left: 60 },
  timeScale: null,
  mmluScale: null,
  rScale: null,
  tooltip: null,
  data: [],
  currentPhaseIndex: 0,
  isPlaying: true,
  animationSpeed: 1,
  timeouts: [],
  metrics: {
    totalModels: 0,
    modelsThisQuarter: 0,
    topMMLU: 0,
    currentPeriod: "2017"
  },

  // ============================================
  // INITIALIZATION
  // ============================================
  async initialize() {
    try {
      document.getElementById("loading").textContent = "Loading model data...";

      // Load data
      await this.loadData();

      document.getElementById("loading").textContent = "Preparing visualization...";

      // Setup SVG
      this.setupSVG();

      // Setup scales
      this.setupScales();

      // Create axes
      this.createAxes();

      // Create legends
      this.createLegend();

      // Setup controls
      this.setupControls();

      // Hide loading
      document.getElementById("loading").classList.add("hidden");

      // Start animation
      this.startAnimation();

    } catch (error) {
      console.error("Initialization error:", error);
      document.getElementById("loading").textContent = `Error: ${error.message}`;
    }
  },

  async loadData() {
    const response = await fetch('Models_table.csv');
    const csvText = await response.text();
    this.data = this.parseCSV(csvText);
    console.log(`Loaded ${this.data.length} models`);
  },

  parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    // Find column indices
    const cols = {
      model: 0,
      provider: headers.findIndex(h => h.toLowerCase().includes('provider') || h.toLowerCase() === 'lab'),
      parameters: headers.findIndex(h => h.toLowerCase().includes('param')),
      announced: headers.findIndex(h => h.toLowerCase().includes('announced')),
      isPublic: headers.findIndex(h => h.toLowerCase().includes('public')),
      mmlu: headers.findIndex(h => h.toLowerCase() === 'mmlu')
    };

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = this.splitCSVLine(lines[i]);
      const model = values[cols.model];
      if (!model) continue;

      const releaseDate = this.parseDate(values[cols.announced]);
      if (!releaseDate || releaseDate > new Date(2025, 11, 31)) continue;

      // Parse parameters
      let params = null;
      if (cols.parameters >= 0 && values[cols.parameters]) {
        const match = values[cols.parameters].match(/(\d+(\.\d+)?)/);
        if (match) params = parseFloat(match[1]);
      }

      // Parse MMLU
      let mmlu = null;
      if (cols.mmlu >= 0 && values[cols.mmlu]) {
        const match = values[cols.mmlu].match(/(\d+(\.\d+)?)/);
        if (match) {
          mmlu = parseFloat(match[1]);
          if (mmlu <= 1) mmlu *= 100;
        }
      }

      // Determine if significant
      const isSignificant = this.significantModels.some(sig =>
        model.toLowerCase().includes(sig.toLowerCase())
      );

      data.push({
        model: model,
        provider: values[cols.provider] || "Unknown",
        parameters: params,
        releaseDate: releaseDate,
        releaseYear: releaseDate.getFullYear(),
        releaseQuarter: Math.floor(releaseDate.getMonth() / 3) + 1,
        releaseMonth: releaseDate.getMonth(),
        source: values[cols.isPublic]?.includes('🟢') || values[cols.isPublic]?.toLowerCase().includes('yes') ? 'Open' : 'Closed',
        mmlu: mmlu,
        isSignificant: isSignificant
      });
    }

    return data.sort((a, b) => a.releaseDate - b.releaseDate);
  },

  splitCSVLine(line) {
    const values = [];
    let inQuotes = false;
    let current = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  },

  parseDate(dateStr) {
    if (!dateStr || dateStr.toLowerCase().includes('tba')) return null;

    // Handle "25-Feb" format
    const shortMatch = dateStr.match(/(\d{2})-([A-Za-z]{3})/);
    if (shortMatch) {
      const year = 2000 + parseInt(shortMatch[1]);
      const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
      const month = months[shortMatch[2].toLowerCase()] ?? 0;
      return new Date(year, month, 1);
    }

    // Handle full year
    const yearMatch = dateStr.match(/(20\d{2}|19\d{2})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const quarterMatch = dateStr.match(/Q([1-4])/i);
      if (quarterMatch) {
        return new Date(year, (parseInt(quarterMatch[1]) - 1) * 3, 1);
      }
      const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
      for (const [name, idx] of Object.entries(months)) {
        if (dateStr.toLowerCase().includes(name)) {
          return new Date(year, idx, 1);
        }
      }
      return new Date(year, 0, 1);
    }

    return null;
  },

  // ============================================
  // SVG SETUP
  // ============================================
  setupSVG() {
    this.svg = d3.select("#timeline");
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    this.svg.selectAll("*").remove();

    this.g = this.svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // Create tooltip
    this.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Add phase title
    this.svg.append("text")
      .attr("class", "phase-title")
      .attr("x", this.width / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle");

    this.svg.append("text")
      .attr("class", "phase-subtitle")
      .attr("x", this.width / 2)
      .attr("y", 55)
      .attr("text-anchor", "middle");
  },

  setupScales() {
    this.timeScale = d3.scaleTime()
      .domain([new Date(2017, 0, 1), new Date(2025, 11, 31)])
      .range([0, this.innerWidth]);

    this.mmluScale = d3.scaleLinear()
      .domain([0, 100])
      .range([this.innerHeight, 0]);

    this.rScale = d3.scaleSqrt()
      .domain([0.1, 1000])
      .range([4, 30]);
  },

  createAxes() {
    // X-axis
    this.xAxis = this.g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.innerHeight})`);

    this.g.append("text")
      .attr("class", "axis-label")
      .attr("x", this.innerWidth / 2)
      .attr("y", this.innerHeight + 50)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .text("Release Date");

    // Y-axis
    this.yAxis = this.g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(this.mmluScale).ticks(5));

    this.g.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.innerHeight / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .text("MMLU Score (%)");

    // Human expert reference line (89%)
    this.g.append("line")
      .attr("class", "reference-line")
      .attr("x1", 0)
      .attr("x2", this.innerWidth)
      .attr("y1", this.mmluScale(89))
      .attr("y2", this.mmluScale(89));

    this.g.append("text")
      .attr("class", "reference-label")
      .attr("x", this.innerWidth - 5)
      .attr("y", this.mmluScale(89) - 5)
      .attr("text-anchor", "end")
      .text("Human Expert Level (89%)");
  },

  createLegend() {
    const legend = this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.width - 140}, ${this.margin.top + 10})`);

    const providers = ["OpenAI", "Anthropic", "Google", "Meta", "Mistral", "Other"];
    const colors = [this.providerColors.OpenAI, this.providerColors.Anthropic,
      this.providerColors.Google, this.providerColors.Meta,
      this.providerColors.Mistral, this.providerColors.default];

    providers.forEach((provider, i) => {
      const item = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      item.append("circle")
        .attr("r", 6)
        .attr("fill", colors[i]);

      item.append("text")
        .attr("x", 12)
        .attr("y", 4)
        .attr("fill", "#333")
        .style("font-size", "11px")
        .text(provider);
    });
  },

  setupControls() {
    // Restart button
    document.getElementById("restartBtn").addEventListener("click", () => {
      this.restart();
    });

    // Speed button
    document.getElementById("speedBtn").addEventListener("click", (e) => {
      const speeds = [1, 1.5, 2, 3];
      const currentIdx = speeds.indexOf(this.animationSpeed);
      this.animationSpeed = speeds[(currentIdx + 1) % speeds.length];
      e.target.textContent = `Speed: ${this.animationSpeed}x`;
    });
  },

  // ============================================
  // METRICS UPDATES
  // ============================================
  updateMetrics(modelsShown, currentDate) {
    // Total models
    this.metrics.totalModels = modelsShown.length;
    document.getElementById("total-models").textContent = this.metrics.totalModels;

    // Models this quarter
    const currentQuarter = Math.floor(currentDate.getMonth() / 3);
    const currentYear = currentDate.getFullYear();
    const quarterModels = modelsShown.filter(d => {
      return d.releaseYear === currentYear &&
        Math.floor(d.releaseMonth / 3) === currentQuarter;
    });
    this.metrics.modelsThisQuarter = quarterModels.length;
    const mqEl = document.getElementById("models-per-quarter");
    mqEl.textContent = this.metrics.modelsThisQuarter;

    // Highlight if high count
    if (this.metrics.modelsThisQuarter > 20) {
      mqEl.classList.add("highlight");
    } else {
      mqEl.classList.remove("highlight");
    }

    // Current period
    const periodStr = currentYear >= 2023 ?
      `Q${currentQuarter + 1} ${currentYear}` :
      currentYear.toString();
    document.getElementById("current-year").textContent = periodStr;

    // Top MMLU
    const mmluScores = modelsShown.filter(d => d.mmlu).map(d => d.mmlu);
    if (mmluScores.length > 0) {
      this.metrics.topMMLU = Math.max(...mmluScores);
      document.getElementById("top-mmlu").textContent =
        `${this.metrics.topMMLU.toFixed(1)}%`;
    }
  },

  // ============================================
  // MILESTONE DISPLAY
  // ============================================
  checkMilestone(currentDate) {
    for (const milestone of this.milestones) {
      // Check if we just passed this milestone
      const daysDiff = (currentDate - milestone.date) / (1000 * 60 * 60 * 24);
      if (daysDiff >= 0 && daysDiff < 60 && !milestone.shown) {
        milestone.shown = true;
        this.showMilestone(milestone);
        return;
      }
    }
  },

  showMilestone(milestone) {
    const banner = document.getElementById("milestone-banner");
    banner.querySelector(".milestone-icon").textContent = milestone.icon;
    banner.querySelector(".milestone-text").innerHTML =
      `${milestone.text}<div class="milestone-subtext">${milestone.subtext}</div>`;
    banner.classList.remove("hidden");

    setTimeout(() => {
      banner.classList.add("hidden");
    }, 3000 / this.animationSpeed);
  },

  // ============================================
  // ANIMATION
  // ============================================
  startAnimation() {
    // Reset milestones
    this.milestones.forEach(m => m.shown = false);

    // Reset metrics
    document.getElementById("total-models").textContent = "0";
    document.getElementById("models-per-quarter").textContent = "0";
    document.getElementById("current-year").textContent = "2017";
    document.getElementById("top-mmlu").textContent = "0%";

    // Start first phase
    this.animatePhase(0);
  },

  animatePhase(phaseIndex) {
    if (phaseIndex >= this.phases.length) {
      console.log("Animation complete");
      return;
    }

    const phase = this.phases[phaseIndex];
    this.currentPhaseIndex = phaseIndex;

    // Update phase title
    this.svg.select(".phase-title").text(phase.name);
    this.svg.select(".phase-subtitle").text(phase.subtitle);

    // Get data for this phase
    const phaseData = phaseIndex === this.phases.length - 1 ?
      this.data : // Final phase shows all
      this.data.filter(d => d.releaseDate >= phase.start && d.releaseDate <= phase.end);

    // Update time scale
    this.timeScale.domain([phase.start, phase.end]);

    // Update x-axis
    this.updateXAxis(phase);

    // Clear existing circles
    this.g.selectAll(".model-circle").remove();
    this.g.selectAll(".model-label").remove();

    // Run force simulation
    const simulation = this.runSimulation(phaseData);

    // Animate models appearing
    this.animateModels(phaseData, phase);

    // Schedule next phase
    const timeout = setTimeout(() => {
      this.animatePhase(phaseIndex + 1);
    }, phase.duration / this.animationSpeed);

    this.timeouts.push(timeout);
  },

  updateXAxis(phase) {
    let tickValues = [];

    if (phase.timeUnit === "year") {
      for (let y = phase.start.getFullYear(); y <= phase.end.getFullYear(); y++) {
        tickValues.push(new Date(y, 0, 1));
      }
    } else if (phase.timeUnit === "quarter") {
      for (let y = phase.start.getFullYear(); y <= phase.end.getFullYear(); y++) {
        for (let q = 0; q < 4; q++) {
          const d = new Date(y, q * 3, 1);
          if (d >= phase.start && d <= phase.end) tickValues.push(d);
        }
      }
    } else if (phase.timeUnit === "month") {
      for (let y = phase.start.getFullYear(); y <= phase.end.getFullYear(); y++) {
        for (let m = 0; m < 12; m += 2) {
          const d = new Date(y, m, 1);
          if (d >= phase.start && d <= phase.end) tickValues.push(d);
        }
      }
    } else if (phase.timeUnit === "week") {
      for (let y = phase.start.getFullYear(); y <= phase.end.getFullYear(); y++) {
        for (let m = 0; m < 12; m++) {
          const d = new Date(y, m, 1);
          if (d >= phase.start && d <= phase.end) tickValues.push(d);
        }
      }
    } else {
      // Mixed
      for (let y = 2017; y <= 2020; y++) tickValues.push(new Date(y, 0, 1));
      for (let y = 2021; y <= 2022; y++) {
        for (let q = 0; q < 4; q++) tickValues.push(new Date(y, q * 3, 1));
      }
      for (let y = 2023; y <= 2025; y++) {
        for (let m = 0; m < 12; m += 3) tickValues.push(new Date(y, m, 1));
      }
    }

    this.xAxis.transition()
      .duration(1000 / this.animationSpeed)
      .call(
        d3.axisBottom(this.timeScale)
          .tickValues(tickValues)
          .tickFormat(phase.tickFormat)
      )
      .selectAll("text")
      .attr("y", 10)
      .attr("x", -5)
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  },

  runSimulation(data) {
    const simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(d => this.timeScale(d.releaseDate)).strength(1))
      .force("y", d3.forceY(d => {
        if (d.mmlu !== null) {
          return this.mmluScale(d.mmlu);
        }
        return this.innerHeight / 2 + (Math.random() - 0.5) * 100;
      }).strength(d => d.mmlu !== null ? 1 : 0.1))
      .force("collide", d3.forceCollide(d =>
        (d.parameters ? this.rScale(d.parameters) : this.rScale(20)) + 2
      ))
      .stop();

    for (let i = 0; i < 150; i++) simulation.tick();
    return simulation;
  },

  animateModels(data, phase) {
    const self = this;
    const sortedData = [...data].sort((a, b) => a.releaseDate - b.releaseDate);
    const delayPerModel = (phase.duration * 0.7) / sortedData.length / this.animationSpeed;

    sortedData.forEach((d, i) => {
      const timeout = setTimeout(() => {
        // Add circle
        const circle = this.g.append("circle")
          .datum(d)
          .attr("class", "model-circle")
          .attr("cx", d.x)
          .attr("cy", d.y)
          .attr("r", 0)
          .attr("fill", this.getColor(d.provider))
          .attr("stroke", d.isSignificant ? "#000" : "#333")
          .attr("stroke-width", d.isSignificant ? 2 : 0.5)
          .attr("opacity", d.isSignificant ? 0.9 : 0.6)
          .on("mouseover", function(event, d) {
            self.showTooltip(event, d);
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#000");
          })
          .on("mouseout", function() {
            self.tooltip.transition().duration(200).style("opacity", 0);
            d3.select(this)
              .attr("stroke-width", d.isSignificant ? 2 : 0.5)
              .attr("stroke", d.isSignificant ? "#000" : "#333");
          });

        circle.transition()
          .duration(300 / this.animationSpeed)
          .attr("r", d.parameters ? this.rScale(d.parameters) : this.rScale(20));

        // Add label only for significant models
        if (d.isSignificant) {
          this.g.append("text")
            .datum(d)
            .attr("class", "model-label significant")
            .attr("x", d.x)
            .attr("y", d.y + (d.parameters ? this.rScale(d.parameters) : this.rScale(20)) + 12)
            .attr("text-anchor", "middle")
            .text(d.model.length > 15 ? d.model.substring(0, 15) + "..." : d.model)
            .attr("opacity", 0)
            .transition()
            .delay(200 / this.animationSpeed)
            .duration(300 / this.animationSpeed)
            .attr("opacity", 1);
        }

        // Update metrics
        const modelsShown = sortedData.slice(0, i + 1);
        this.updateMetrics(modelsShown, d.releaseDate);

        // Check for milestones
        this.checkMilestone(d.releaseDate);

      }, i * delayPerModel);

      this.timeouts.push(timeout);
    });
  },

  getColor(provider) {
    for (const [key, color] of Object.entries(this.providerColors)) {
      if (provider && provider.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    return this.providerColors.default;
  },

  showTooltip(event, d) {
    this.tooltip.transition().duration(200).style("opacity", 0.95);

    const mmluText = d.mmlu ? `<span class="highlight">${d.mmlu.toFixed(1)}%</span>` : "N/A";
    const paramsText = d.parameters ? `${d.parameters}B` : "Unknown";
    const dateText = d.releaseYear >= 2022 ?
      `Q${d.releaseQuarter} ${d.releaseYear}` :
      d.releaseYear.toString();

    this.tooltip.html(`
      <h4>${d.model}</h4>
      <p>Provider: ${d.provider}</p>
      <p>Released: ${dateText}</p>
      <p>Parameters: ${paramsText}</p>
      <p>Source: ${d.source}</p>
      <p>MMLU: ${mmluText}</p>
    `)
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY - 20) + "px");
  },

  restart() {
    // Clear all timeouts
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];

    // Clear visualization
    this.g.selectAll(".model-circle").remove();
    this.g.selectAll(".model-label").remove();

    // Restart
    this.startAnimation();
  }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  StoryMode.initialize();
});
