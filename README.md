<div align="center">
  <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="100" alt="GitHub Logo" />
  <h1>GitHub Profile UI Clone</h1>
  <p><i>A meticulously crafted, high-fidelity front-end clone of the GitHub user profile ecosystem.</i></p>

  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
</div>

---

## 📖 Overview

This project is a pixel-perfect replication of a GitHub profile and repository view. Built entirely from scratch using **Vanilla HTML, CSS, and JavaScript**, it mimics the complex UI layouts, responsive design states, and dynamic data visualization (such as the contribution heatmap) of the actual GitHub platform.

## 🏗️ Component Architecture

The clone is built using a modular component structure to maintain the layout logic across different repository pages.

```mermaid
graph TD
    A[index.html <br> Profile View] --> B(Navbar & Global Footer)
    A --> C(User Sidebar)
    A --> D(Main Content Area)
    
    C --> C1(Avatar & Status)
    C --> C2(Follower Stats)
    C --> C3(Organizations)
    
    D --> D1(Pinned Repositories Grid)
    D --> D2(Contribution Heatmap Engine)
    D --> D3(Activity Timeline)

    E[repo-100-days-dsa.html <br> Repository View] --> B
    E --> F(Repo Header & Navigation)
    E --> G(Dynamic File List)
    E --> H(Repo Sidebar & Languages)
    
    classDef main fill:#2ea043,stroke:#39d353,stroke-width:2px,color:#fff;
    classDef sub fill:#161b22,stroke:#30363d,stroke-width:1px,color:#fff;
    class A,E main;
    class B,C,D,C1,C2,C3,D1,D2,D3,F,G,H sub;
```

## 🟩 Dynamic Heatmap Engine (The Core Feature)

Recreating the iconic GitHub contribution graph was the most complex technical hurdle. The 53-week contribution grid is dynamically generated via JavaScript (`main.js`), bypassing the need for static SVGs.

### Rendering Algorithm Flow

```mermaid
sequenceDiagram
    participant DOM as Browser DOM
    participant JS as main.js (Heatmap Engine)
    participant Data as Data Calculation
    
    DOM->>JS: DOMContentLoaded Event
    JS->>Data: Calculate total grid days (53 weeks * 7)
    JS->>Data: Generate Month Labels (Jan-Dec)
    Data-->>JS: Filter overlapping month labels
    JS->>DOM: Render Month & Day Headers
    
    loop For each day in 53 weeks
        JS->>Data: Calculate 'Days Ago' reverse index
        Data-->>JS: Return Contribution Level (0-4)
        JS->>Data: Map to Custom DSA Timeline (100 days)
        JS->>DOM: Inject <div class="day level-X">
        JS->>DOM: Attach Tooltip Data Attributes
    end
    
    JS->>DOM: Initialize Tooltip Hover Listeners
```

## ⏱️ The 100-Day DSA Challenge Schedule

A unique feature of this clone is the custom algorithm that specifically mimics a 100-day Data Structures and Algorithms challenge. The script aligns both the heatmap squares and the commit dates in the repository view.

```mermaid
gantt
    title Custom 100-Day DSA Commit Logic
    dateFormat  YYYY-MM-DD
    axisFormat  %m-%d
    
    section Heatmap Timeline
    Background Activity (Sparse) :done, 2025-05-01, 2026-02-01
    90-Day DSA Streak (1 Commit/Day) :active, 2026-02-02, 90d
    Final Submission (10 Commits) :crit, 2026-05-03, 1d
```

### Time-Sync Logic
1. **Days 1 to 90:** Generates precisely 1 commit per day, resulting in a continuous, uninterrupted 90-day block of green on the heatmap.
2. **Day 91 (Today):** A massive spike showing exactly **10 commits**, glowing the brightest green (`level-4`).
3. **Repository Sync:** The simulated file list inside `repo-100-days-dsa.html` matches these dates dynamically. Files 1-90 decrement by 1 day, while Files 91-100 all share the "Today" tag.

## 🛠️ The Build Process & Technologies

*   **Custom CSS Variables:** Instead of external frameworks, the styling utilizes deeply nested CSS variables for the GitHub Dark Theme (`--color-canvas-default`, `--color-border-muted`, etc.) ensuring universal color syncing.
*   **Grid & Flexbox:** The heatmap grid relies heavily on `display: grid; grid-auto-flow: column;` to map dates top-to-bottom, left-to-right exactly like the real platform.
*   **Responsive Collapsing:** Employs media queries to collapse the sidebars and stack elements on screens smaller than `768px`.
*   **Native SVG Octicons:** Utilizes raw GitHub SVG paths for pixel-perfect forks, stars, and navigation icons.
*   **`.nojekyll` Bypass:** A hidden configuration file ensures GitHub Pages serves the raw custom code without attempting to process it through the Jekyll static site generator.

## 🚀 How to Run Locally

Because this project uses vanilla frontend technologies, you do not need `npm`, `node`, or a local server to view it.

1. Clone or download this repository to your machine.
2. Open `index.html` directly in Chrome, Firefox, or Safari.
3. Click through the repositories (like `100-days-dsa.html`) to see the dynamic file rendering.

---
<div align="center">
  <p><i>Disclaimer: This is a purely frontend UI clone created for educational and design practice purposes. It is not affiliated with GitHub, Inc.</i></p>
</div>
