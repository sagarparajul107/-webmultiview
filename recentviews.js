function loadRecentViews() {
    const recentViewsList = document.getElementById('recent-views-list');
    const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    
    recentViewsList.innerHTML = history.map(item => `
        <div class="recent-view-item bg-white p-4 rounded-lg shadow-md mb-4">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-semibold">${item.url}</h3>
                    <p class="text-sm text-gray-600">Views: ${item.count}</p>
                    <p class="text-xs text-gray-500">${new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <button onclick="reloadView('${item.url}', ${item.count})" class="bg-blue-500 text-white px-4 py-2 rounded">
                    Reload
                </button>
            </div>
        </div>
    `).join('');
}

function reloadView(url, count) {
    // Store parameters and redirect to index
    sessionStorage.setItem('reloadUrl', url);
    sessionStorage.setItem('reloadCount', count);
    window.location.href = 'index.html';
}

// Load recent views when page loads
document.addEventListener('DOMContentLoaded', loadRecentViews);
