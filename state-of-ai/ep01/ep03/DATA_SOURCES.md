# Episode 3: Data Sources & Traceability

This document tracks all data points used in visualizations with their sources for verification.

---

## Opening: Large-Scale AI Systems by Country

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| US Large-Scale AI Models | ~155 cumulative | [Epoch AI via Our World in Data](https://ourworldindata.org/grapher/cumulative-number-of-large-scale-ai-systems-by-country) | 2025 | Training compute > 10²³ FLOP |
| China Large-Scale AI Models | ~105 cumulative | [Epoch AI via Our World in Data](https://ourworldindata.org/grapher/cumulative-number-of-large-scale-ai-systems-by-country) | 2025 | Training compute > 10²³ FLOP |

---

## Opening: Frontier Intelligence Index by Company

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| OpenAI Index Score | ~75 | [MacroMicro](https://en.macromicro.me/) | Jan 2026 | US leader |
| Google Index Score | ~65 | [MacroMicro](https://en.macromicro.me/) | Jan 2026 | |
| Anthropic Index Score | ~62 | [MacroMicro](https://en.macromicro.me/) | Jan 2026 | |
| DeepSeek Index Score | ~62 | [MacroMicro](https://en.macromicro.me/) | Jan 2026 | Rapid catch-up from mid-2025 |
| Alibaba Index Score | ~60 | [MacroMicro](https://en.macromicro.me/) | Jan 2026 | |
| China Gap Closure | ~18 months | [MacroMicro](https://en.macromicro.me/) | 2024-2025 | From trailing to parity |

---

## Open Ecosystem: Hugging Face Downloads

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| Qwen Cumulative Downloads | ~400M | [Stanford HAI / ATOM Project](https://hai.stanford.edu/) | Oct 2025 | Surpassed Llama |
| Llama Cumulative Downloads | ~350M | [Stanford HAI / ATOM Project](https://hai.stanford.edu/) | Oct 2025 | Meta's open-weight family |
| DeepSeek Downloads | ~100M | [Stanford HAI / ATOM Project](https://hai.stanford.edu/) | Oct 2025 | Rapid growth from mid-2025 |
| Mistral Downloads | ~90M | [Stanford HAI / ATOM Project](https://hai.stanford.edu/) | Oct 2025 | European alternative |

---

## Open Ecosystem: ChatBot Arena Rankings

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| #1 Open Model | GLM-4.6 (Z.ai, China) | [OpenLM ChatBot Arena via Stanford HAI](https://hai.stanford.edu/) | Dec 4, 2025 | Elo 1442 |
| #2 Open Model | Kimi-K2-Thinking (Moonshot, China) | [OpenLM ChatBot Arena via Stanford HAI](https://hai.stanford.edu/) | Dec 4, 2025 | Elo 1438 |
| Top US Open Model | gpt-oss-120b (OpenAI) | [OpenLM ChatBot Arena via Stanford HAI](https://hai.stanford.edu/) | Dec 4, 2025 | Rank #3, Elo 1368 |
| Chinese models in Top 25 | ~20 | [OpenLM ChatBot Arena via Stanford HAI](https://hai.stanford.edu/) | Dec 4, 2025 | Dominant presence |

---

## Open Ecosystem: Model Capabilities by Country

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| China Open Model Parity | Achieved 2024-2025 | [Epoch AI via Stanford HAI](https://hai.stanford.edu/) | 2025 | Pink triangles match blue squares |
| Open vs Closed Gap | Shrinking | [Epoch AI via Stanford HAI](https://hai.stanford.edu/) | 2025 | Gray (closed) still leads but gap narrowing |

---

## P1: Training Cost Comparison

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| DeepSeek-V3 Training Cost (GPU only) | $5.6M | [DeepSeek Technical Report](https://arxiv.org/abs/2412.19437) | Dec 2024 | 2.78M GPU hours on H800s |
| DeepSeek-V3 Total Infrastructure | ~$1.3B | [SemiAnalysis via Gregory Bufithis](https://www.gregorybufithis.com/2025/02/07/deepseeks-ai-training-only-cost-6-million-ah-no-more-like-1-3-billion/) | Feb 2025 | Including R&D, servers, research |
| GPT-4 Training Cost | ~$100M+ | Industry estimates, [The Information](https://www.theinformation.com) | 2023 | OpenAI has not disclosed official cost |
| Llama 3 Training Cost | ~$500M+ | [Meta public statements](https://ai.meta.com/blog/meta-llama-3/) | Apr 2024 | 30.8M GPU hours |
| DeepSeek GPU Hours | 2.78M | [DeepSeek Technical Report](https://arxiv.org/abs/2412.19437) | Dec 2024 | |
| Llama 3 GPU Hours | 30.8M | [Meta Llama 3 Technical Report](https://ai.meta.com/research/publications/llama-3-1/) | Jul 2024 | |

---

## P2: MoE Architecture

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| DeepSeek-V3 Total Parameters | 671B | [DeepSeek Technical Report](https://arxiv.org/abs/2412.19437) | Dec 2024 | |
| Active Parameters Per Token | 37B | [DeepSeek Technical Report](https://arxiv.org/abs/2412.19437) | Dec 2024 | |
| Activation Ratio | 5.5% | Calculated (37B/671B) | - | |
| MLA Memory Reduction | 50%+ | [DeepSeek Technical Report](https://arxiv.org/abs/2412.19437) | Dec 2024 | vs standard MHA |

---

## P3: China Infrastructure Map

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| East Data West Computing Launch | 2022 | [NDRC Official Announcement](http://www.gov.cn/xinwen/2022-02/17/content_5674284.htm) | Feb 2022 | |
| DC Renewable Target | 80% by 2025 | [Carbon Brief](https://www.carbonbrief.org/explainer-how-china-is-managing-the-rising-energy-demand-from-data-centres/) | 2024 | For new data centers |
| Current Coal Power for DCs | 70% | [Carbon Brief](https://www.carbonbrief.org/explainer-how-china-is-managing-the-rising-energy-demand-from-data-centres/) | 2024 | |
| PUE Target | <1.2 | [ACT Group](https://www.actgroup.com/latest/blogs/china-s-gec-update-what-it-means-for-data-centers) | 2024 | For national hub nodes |
| Network Latency to West | <20ms | [ICDS Analysis](https://icds.ee/en/more-than-meets-the-ai-chinas-data-centre-strategy/) | 2024 | |
| Western Electricity Cost | 50% cheaper | [Premia Partners](https://www.premia-partners.com/insight/china-s-east-data-west-computing-initiative-power-infrastructure-as-the-next-big-thing-in-the-global-ai-race) | 2024 | vs eastern provinces |
| Energy Demand 2022 | 77 TWh | [Carbon Brief](https://www.carbonbrief.org/explainer-how-china-is-managing-the-rising-energy-demand-from-data-centres/) | 2024 | |
| Energy Demand 2030 (projected) | 400 TWh | [Carbon Brief](https://www.carbonbrief.org/explainer-how-china-is-managing-the-rising-energy-demand-from-data-centres/) | 2024 | |
| Emissions Reduction by 2030 | 16-20% | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2095809924005058) | 2024 | From DC sector |
| Economic Benefits by 2030 | $53B | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2095809924005058) | 2024 | Direct benefits |

### Hub Locations

| Hub | Province | Type | Source |
|-----|----------|------|--------|
| Beijing-Tianjin-Hebei | Northern | Computing Hub | NDRC |
| Yangtze River Delta | Shanghai area | Computing Hub | NDRC |
| Greater Bay Area | Guangdong | Computing Hub | NDRC |
| Chengdu-Chongqing | Sichuan | National Hub | NDRC |
| Inner Mongolia | North | Training/Storage | NDRC |
| Guizhou | Southwest | Training/Storage | NDRC |
| Gansu | Northwest | Training/Storage | NDRC |
| Ningxia | Northwest | Training/Storage | NDRC |

---

## P4: Big Fund III Phases

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| Big Fund III Size | $47.5B (344B yuan) | [Caixin Global](https://www.caixinglobal.com/2024-05-28/china-piles-475-billion-into-big-fund-iii-to-boost-chip-development-102200633.html) | May 2024 | |
| Big Fund III Launch | May 24, 2024 | [Tom's Hardware](https://www.tomshardware.com/tech-industry/china-starts-big-fund-iii-spending-usd47-billion-for-ecosystem-and-fab-tools) | 2024 | |
| Big Fund III Duration | 2024-2039 | [Wikipedia](https://en.wikipedia.org/wiki/China_Integrated_Circuit_Industry_Investment_Fund) | - | 15-year fund |
| Phase I Investment | ~$100B | [Eurasia Review](https://www.eurasiareview.com/10122025-big-fund-iii-chinas-long-game-to-control-the-chips-that-make-the-world-work-analysis/) | Dec 2025 | 2014-2019 |
| Phase II Investment | $41B | [Eurasia Review](https://www.eurasiareview.com/10122025-big-fund-iii-chinas-long-game-to-control-the-chips-that-make-the-world-work-analysis/) | Dec 2025 | 2019-2024 |
| AI Semiconductor Subsidiary | $8.2B | [TechCrunch](https://techcrunch.com/2024/05/28/chinas-47b-semiconductor-fund-puts-chip-sovereignty-front-and-center/) | Jan 2025 | |
| US CHIPS Act Direct Incentives | $39B | [Nikkei Asia](https://asia.nikkei.com/business/tech/semiconductors/china-s-3rd-semiconductor-big-fund-starts-spending-47bn-war-chest) | 2024 | For comparison |
| China Development Bank Stake | 17.4% | [SCMP](https://www.scmp.com/tech/tech-war/article/3264612/tech-war-chinas-big-fund-iii-brings-us475-billion-fresh-outlay-nations-semiconductor-supply-chain) | 2024 | Largest shareholder |

---

## P5: Humanoid Price Comparison

| Robot | Price | Source | Date | Notes |
|-------|-------|--------|------|-------|
| Unitree G1 | $16,000 | [Unitree Official](https://www.unitree.com/g1/) | 2024 | Base model |
| Unitree G1 EDU | Custom pricing | [Unitree Official](https://www.unitree.com/g1/) | 2024 | Advanced version |
| Tesla Optimus Gen 2 | $20,000-$30,000 | Industry estimates, [Musk statements](https://twitter.com/elonmusk) | 2024 | Target price |
| UBTech Walker S2 | ~$50,000+ | [UBTech Enterprise](https://www.ubtrobot.com/en/humanoid/solutions) | 2025 | Industrial model |
| Fourier GR-1 | ~$125,000 | [BotInfo](https://botinfo.ai/articles/unitree-g1) | 2024 | Healthcare focus |
| Western Research Robots | $90,000+ | [Robot Report](https://www.therobotreport.com/unitree-robotics-unveils-g1-humanoid-for-16k/) | 2024 | Comparable platforms |

### Specifications

| Spec | Unitree G1 | Tesla Optimus Gen 2 | UBTech Walker S | Fourier GR-1 |
|------|------------|---------------------|-----------------|--------------|
| Height | 127 cm | 173 cm | ~170 cm | 165 cm |
| Weight | 35 kg | ~57 kg | - | - |
| DOF | 23-43 | 40 | 41+ | 44 |
| Payload | 2 kg | 20 kg | ~15 kg | 50 kg |
| Speed | 2 m/s | 8 km/h | Walking | 5 km/h |

Sources: [Unitree](https://www.unitree.com/g1/), [Tesla](https://www.tesla.com/we-robot), [UBTech](https://www.ubtrobot.com), [Fourier](https://www.fourierintelligence.com/)

---

## P6: VC Investment Divergence

| Data Point | Value | Source | Date | Notes |
|------------|-------|--------|------|-------|
| China VC 2024 Total | $40.2B | [PitchBook](https://pitchbook.com/news/articles/chinas-vc-future-hangs-in-the-balance) | 2025 | |
| China VC 2024 YoY Change | -36.7% | [PitchBook](https://pitchbook.com/news/articles/chinas-vc-future-hangs-in-the-balance) | 2025 | |
| US VC Q4 2024 | $74.6B | [KPMG Venture Pulse](https://kpmg.com/xx/en/media/press-releases/2025/01/2024-global-vc-investment-rises-to-368-billion-dollars.html) | Jan 2025 | |
| US VC 2024 YoY Change | +29.6% | [PitchBook](https://pitchbook.com/news/articles/chinas-vc-future-hangs-in-the-balance) | 2025 | |
| China Foreign Participation 2021 | 18% | [PitchBook](https://pitchbook.com/news/articles/chinas-vc-future-hangs-in-the-balance) | 2025 | Of rounds |
| China Foreign Participation 2024 | 8.5% | [PitchBook](https://pitchbook.com/news/articles/chinas-vc-future-hangs-in-the-balance) | 2025 | Of rounds |
| Global VC 2024 | $368.3B | [KPMG Venture Pulse](https://kpmg.com/xx/en/media/press-releases/2025/01/2024-global-vc-investment-rises-to-368-billion-dollars.html) | Jan 2025 | |
| Americas VC 2024 | $221.7B | [KPMG Venture Pulse](https://kpmg.com/xx/en/media/press-releases/2025/01/2024-global-vc-investment-rises-to-368-billion-dollars.html) | Jan 2025 | |
| China Q4 2024 | $5.8B | [KPMG Venture Pulse](https://kpmg.com/xx/en/media/press-releases/2025/01/2024-global-vc-investment-rises-to-368-billion-dollars.html) | Jan 2025 | Down from $10.3B Q3 |

### Top AI Investments Q4 2024

| Company | Amount | Source |
|---------|--------|--------|
| Databricks | $10B | KPMG |
| OpenAI | $6.6B | KPMG |
| xAI | $6B | KPMG |
| Waymo | $5B | KPMG |
| Anthropic | $4B | KPMG |

---

## P7: Bifurcation Stack Diagram

| Layer | Western Stack | Chinese Stack | Source |
|-------|---------------|---------------|--------|
| **Hardware** | NVIDIA CUDA | Huawei Ascend | Industry analysis |
| **GPUs** | H100, Blackwell | Ascend 910B, 910C | [Huawei](https://www.huawei.com/en/news/2024/9/huawei-connect-2024-ascend), [NVIDIA](https://www.nvidia.com) |
| **Memory** | HBM3 (SK Hynix, Samsung) | Domestic HBM (CXMT) | [Tom's Hardware](https://www.tomshardware.com) |
| **Frontier Models** | OpenAI, Anthropic, Google | DeepSeek, Qwen, Yi | Various |
| **Model Licensing** | Mostly Proprietary | Mostly Open Weights | Industry analysis |
| **Cloud** | AWS, Azure, GCP | Alibaba Cloud, Tencent Cloud | Industry analysis |

---

## Jack Ma / Xi Jinping Summit

| Data Point | Value | Source | Date |
|------------|-------|--------|------|
| Summit Date | February 17, 2025 | [CNN](https://www.cnn.com/2025/02/17/tech/china-jack-ma-alibaba-meeting-hnk-intl/index.html) | Feb 2025 |
| Attendees | Jack Ma, Ren Zhengfei, Pony Ma, Wang Chuanfu, Liang Wenfeng, Lei Jun | [Fortune](https://fortune.com/asia/2025/02/18/who-met-xi-jinping-china-tech-meeting-jack-ma-huawei-byd-deepseek-unitree-xiaomi/) | Feb 2025 |
| Alibaba Stock Jump | 6%+ | [Fortune](https://fortune.com/asia/2025/02/14/alibaba-shares-reports-jack-ma-xi-jinping-to-meet/) | Feb 2025 |
| Tech Crackdown Market Impact | $1+ trillion | [CNN](https://www.cnn.com/2025/02/17/tech/china-jack-ma-alibaba-meeting-hnk-intl/index.html) | - |
| Ant Group IPO (cancelled) | $37B | [NPR](https://www.npr.org/2025/03/01/nx-s1-5308604/alibaba-founder-jack-ma-returns-5-years-after-largely-disappearing-from-public-view) | Nov 2020 |
| Alibaba Fine | $2.8B | [NPR](https://www.npr.org/2025/03/01/nx-s1-5308604/alibaba-founder-jack-ma-returns-5-years-after-largely-disappearing-from-public-view) | Apr 2021 |

---

## UBTech Deployments

| Data Point | Value | Source | Date |
|------------|-------|--------|------|
| Walker S2 Orders | ¥800M+ (~$112M) | [PR Newswire](https://www.prnewswire.com/news-releases/ubtech-humanoid-robot-walker-s2-begins-mass-production-and-delivery-with-orders-exceeding-800-million-yuan-302616924.html) | Nov 2025 |
| 2025 Delivery Target | 500 units | [PR Newswire](https://www.prnewswire.com/news-releases/ubtech-humanoid-robot-walker-s2-begins-mass-production-and-delivery-with-orders-exceeding-800-million-yuan-302616924.html) | Nov 2025 |
| 2026 Capacity Target | 5,000 units | [PR Newswire](https://www.prnewswire.com/news-releases/ubtech-humanoid-robot-walker-s2-begins-mass-production-and-delivery-with-orders-exceeding-800-million-yuan-302616924.html) | Nov 2025 |
| 2027 Capacity Target | 10,000 units | [PR Newswire](https://www.prnewswire.com/news-releases/ubtech-humanoid-robot-walker-s2-begins-mass-production-and-delivery-with-orders-exceeding-800-million-yuan-302616924.html) | Nov 2025 |
| NIO Deployment | First humanoid-human collab | [People's Daily](https://en.people.cn/n3/2025/0429/c90000-20309191.html) | 2024 |
| Geely/Zeekr Deployment | 21 consecutive days | [GD Today](https://www.newsgd.com/node_5c070fdd03/c7e4e7822d.shtml) | 2025 |
| Factory Partners | BYD, Geely, FAW-VW, Audi FAW, BAIC, Foxconn | [eWeek](https://www.eweek.com/news/china-deploys-humanoid-robots-ubtech-walker/) | 2025 |

---

*Last Updated: December 31, 2025*
*Compiled for State of AI 2025 Episode 3: The Red Silicon Curtain*
