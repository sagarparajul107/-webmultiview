document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    // Set theme
    document.getElementById('theme-selector').value = settings.theme || 'light';
    document.getElementById('layout-selector').value = settings.layout || 'grid';
    document.getElementById('auto-refresh').checked = settings.autoRefresh || false;
    document.getElementById('history-days').value = settings.historyDays || 7;

    // Add event listeners
    document.getElementById('theme-selector').addEventListener('change', updateTheme);
    document.getElementById('layout-selector').addEventListener('change', updateLayout);
});

function updateTheme(e) {
    const theme = e.target.value;
    document.documentElement.setAttribute('data-theme', theme);
    saveSettings();
}

function updateLayout(e) {
    const layout = e.target.value;
    // Update layout preference
    saveSettings();
}

function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-selector').value,
        layout: document.getElementById('layout-selector').value,
        autoRefresh: document.getElementById('auto-refresh').checked,
        historyDays: document.getElementById('history-days').value
    };
    localStorage.setItem('settings', JSON.stringify(settings));
}
