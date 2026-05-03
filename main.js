document.addEventListener('DOMContentLoaded', () => {
    generateHeatmap();
    setupTabs();
    setupTooltips();
    setupSearch();
    setupHeatmapTabs();
});

function generateHeatmap(isPastYear = false) {
    const heatmap = document.getElementById('heatmap');
    if (!heatmap) return;

    heatmap.innerHTML = '';

    const totalDays = 53 * 7;
    const now = new Date();
    if (isPastYear) {
        now.setFullYear(now.getFullYear() - 1);
    }
    
    generateMonths(now, isPastYear, totalDays);
    
    for (let i = 0; i < totalDays; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        
        const date = new Date(now);
        date.setDate(now.getDate() - (totalDays - 1 - i));
        
        const isToday = !isPastYear && (i === totalDays - 1);
        const reverseIndex = totalDays - i;
        
        let level = getContributionLevel(i, totalDays, isPastYear);
        
        if (level > 0) {
            day.classList.add(`level-${level}`);
        }
        
        let commits = 'No';
        if (!isPastYear) {
            if (reverseIndex === 1) {
                commits = 10;
            } else if (reverseIndex >= 2 && reverseIndex <= 91) {
                commits = 1;
            } else {
                commits = level === 0 ? 'No' : level;
            }
        } else {
            commits = level === 0 ? 'No' : level;
        }
        
        day.setAttribute('data-tooltip', `${commits === 'No' ? 'No' : commits} contributions on ${date.toDateString()}`);
        heatmap.appendChild(day);
    }
    setupTooltips();
}

function generateMonths(now, isPastYear, totalDays) {
    const monthsContainer = document.getElementById('months-labels');
    if (!monthsContainer) return;
    monthsContainer.innerHTML = '';
    
    const startDate = new Date(now);
    // top-left date corresponds to i=0
    startDate.setDate(startDate.getDate() - (totalDays - 1));
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let months = [];
    for (let c = 0; c < 53; c++) {
        const colDate = new Date(startDate);
        colDate.setDate(startDate.getDate() + c * 7);
        const month = colDate.getMonth();
        
        if (months.length === 0 || months[months.length - 1].month !== month) {
            months.push({ month, col: c });
        }
    }
    
    // Remove the first month label if it overlaps with the second one
    if (months.length > 1 && months[1].col - months[0].col <= 2) {
        months.shift();
    }
    
    months.forEach(m => {
        const span = document.createElement('span');
        span.classList.add('month-label');
        span.textContent = monthNames[m.month];
        span.style.left = `${m.col * 13}px`;
        monthsContainer.appendChild(span);
    });
}

function getContributionLevel(index, total, isPastYear = false) {
    const reverseIndex = total - index; // 1 is today, 2 is yesterday...
    
    if (!isPastYear) {
        if (reverseIndex === 1) {
            return 4; // Today: 10 commits (level 4)
        }
        if (reverseIndex >= 2 && reverseIndex <= 91) {
            return 2; // 90 days before today: 1 commit per day
        }
    }
    
    // Make the rest of the year mostly green with only ~3-4 ungreen boxes total
    const random = Math.random();
    if (random < 0.01) return 0; // ~1% chance of 0 (about 3-4 days in a year)
    if (random < 0.2) return 1;
    if (random < 0.6) return 2;
    if (random < 0.85) return 3;
    return 4;
}

function setupTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    document.body.appendChild(tooltip);

    document.querySelectorAll('.day').forEach(day => {
        day.addEventListener('mouseenter', (e) => {
            const text = day.getAttribute('data-tooltip');
            tooltip.textContent = text;
            tooltip.style.display = 'block';
            
            const rect = day.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX - tooltip.offsetWidth / 2 + 5}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 35}px`;
        });
        
        day.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            if (tab.getAttribute('href') === '#') {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.repo-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const repoItems = document.querySelectorAll('.repo-list-item');
        
        repoItems.forEach(item => {
            const repoName = item.querySelector('.repo-name-link').textContent.toLowerCase();
            const repoDescElement = item.querySelector('.repo-list-description');
            const repoDesc = repoDescElement ? repoDescElement.textContent.toLowerCase() : '';
            
            if (repoName.includes(searchTerm) || repoDesc.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function setupHeatmapTabs() {
    const yearBtns = document.querySelectorAll('.year-btn');
    if (!yearBtns.length) return;

    yearBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            yearBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            generateHeatmap(btn.textContent.trim() === '2025');
        });
    });
}
