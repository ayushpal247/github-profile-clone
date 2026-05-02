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
    
    for (let i = 0; i < totalDays; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        
        const date = new Date(now);
        date.setDate(now.getDate() - (totalDays - i));
        
        const isLast90Days = !isPastYear && (totalDays - i) <= 90;
        const isToday = !isPastYear && (i === totalDays - 1);
        
        let level = getContributionLevel(i, totalDays, isLast90Days, isPastYear);
        if (isToday) level = 4; // Force level 4 for today
        
        if (level > 0) {
            day.classList.add(`level-${level}`);
        }
        
        // Tooltip logic: cap at 3, but today is 10
        let commits;
        if (isToday) {
            commits = 10;
        } else {
            commits = level === 0 ? 'No' : (isPastYear ? Math.min(level + 1, 4) : Math.min(level, 3));
        }
        
        day.setAttribute('data-tooltip', `${commits} contributions on ${date.toDateString()}`);
        heatmap.appendChild(day);
    }
    setupTooltips();
}

function getContributionLevel(index, total, isLast90Days, isPastYear = false) {
    const reverseIndex = total - index; // 1 is today, 2 is yesterday...
    
    if (isLast90Days) {
        // Force ungreen for exactly 3 days (e.g., 45, 60, 75 days ago)
        if (reverseIndex === 45 || reverseIndex === 60 || reverseIndex === 75) {
            return 0;
        }
        
        // Return a level 1-4 for everything else in the last 90 days
        const random = Math.random();
        if (random > 0.8) return 4;
        if (random > 0.5) return 3;
        if (random > 0.2) return 2;
        return 1;
    }
    
    if (isPastYear) {
        const random = Math.random();
        if (random > 0.9) return 3;
        if (random > 0.7) return 2;
        if (random > 0.5) return 1;
        return 0;
    }

    // Sparse activity for older days
    const random = Math.random();
    if (random > 0.98) return 2;
    if (random > 0.95) return 1;
    return 0;
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
