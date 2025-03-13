function initializePage() {
    if (!localStorage.getItem('userOnboarded')) {
        window.location.href = 'welcome.html';
        return;
    }

    initializeSidebar();
    loadTheme();
}

function initializeSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Set active menu item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Call initializePage when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

document.getElementById('close-sidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
});

document.getElementById('url-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const urlInput = document.getElementById('url-input').value;
    const viewCount = parseInt(document.getElementById('view-count').value);
    
    if (!isValidUrl(urlInput)) {
        alert('Please enter a valid URL');
        return;
    }

    // Show progress popup
    const progressPopup = document.getElementById('progress-popup');
    const progressBar = document.getElementById('progress-bar');
    const currentCount = document.getElementById('current-count');
    const totalCount = document.getElementById('total-count');
    
    progressPopup.style.display = 'block';
    totalCount.textContent = viewCount;
    currentCount.textContent = '0';
    progressBar.style.width = '0%';
    
    // Save to history
    saveToHistory(urlInput, viewCount);
    
    // Create views with progress
    const viewsContainer = document.getElementById('views-container');
    viewsContainer.innerHTML = ''; // Clear existing views
    
    for (let i = 0; i < viewCount; i++) {
        setTimeout(() => {
            // Create view wrapper
            const viewWrapper = document.createElement('div');
            viewWrapper.className = 'view-wrapper';
            
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = urlInput;
            iframe.className = 'view-frame';
            iframe.style.width = '100%';
            iframe.style.height = '400px'; // Set a fixed height
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
            
            // Create view number
            const viewNumber = document.createElement('span');
            viewNumber.className = 'view-number';
            viewNumber.textContent = `View ${i + 1}`;
            
            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => viewWrapper.remove();
            
            // Assemble view
            viewWrapper.appendChild(viewNumber);
            viewWrapper.appendChild(iframe);
            viewWrapper.appendChild(removeBtn);
            viewsContainer.appendChild(viewWrapper);
            
            // Update progress
            const progress = ((i + 1) / viewCount) * 100;
            progressBar.style.width = `${progress}%`;
            currentCount.textContent = i + 1;
            
            // Auto-refresh functionality
            if (localStorage.getItem('auto-refresh') === 'true') {
                setInterval(() => {
                    iframe.src = iframe.src;
                }, 30000); // Refresh every 30 seconds
            }
            
            // Close popup when all views are created
            if (i === viewCount - 1) {
                setTimeout(() => {
                    progressPopup.style.display = 'none';
                }, 1000);
            }
        }, i * 500); // Create each view with a slight delay
    }
});

// Add CSS styles for the views
const style = document.createElement('style');
style.textContent = `
    .views-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        padding: 1rem;
        margin-bottom: 60px;
    }
    .view-wrapper {
        position: relative;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .view-frame {
        border: none;
    }
    .view-number {
        position: absolute;
        top: 8px;
        left: 8px;
        background: rgba(0,0,0,0.5);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    .remove-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ff4444;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
    }
    .remove-btn:hover {
        background: #cc0000;
    }
`;
document.head.appendChild(style);

function saveToHistory(url, count) {
    const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    history.unshift({
        url: url,
        count: count,
        timestamp: new Date().toISOString(),
        settings: {
            theme: localStorage.getItem('theme') || 'light',
            layout: localStorage.getItem('layout') || 'grid'
        }
    });
    
    // Keep only last 20 entries
    const trimmedHistory = history.slice(0, 20);
    localStorage.setItem('viewHistory', JSON.stringify(trimmedHistory));
}

// Apply settings from localStorage
function applySettings() {
    const theme = localStorage.getItem('theme') || 'light';
    const layout = localStorage.getItem('layout') || 'grid';
    
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('views-container').className = `views-container layout-${layout}`;
}

// Listen for storage changes
window.addEventListener('storage', (event) => {
    if (event.key === 'theme' || event.key === 'layout') {
        applySettings();
    }
});

// Apply settings on page load
document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    
    // Check for reload parameters from recent views
    const reloadUrl = sessionStorage.getItem('reloadUrl');
    const reloadCount = sessionStorage.getItem('reloadCount');
    
    if (reloadUrl && reloadCount) {
        document.getElementById('url-input').value = reloadUrl;
        document.getElementById('view-count').value = reloadCount;
        sessionStorage.removeItem('reloadUrl');
        sessionStorage.removeItem('reloadCount');
        document.getElementById('url-form').dispatchEvent(new Event('submit'));
    }
});

function createViews(url, count) {
    const viewsContainer = document.getElementById('views-container');
    const progressPopup = document.getElementById('progress-popup');
    
    // Show progress popup
    progressPopup.style.display = 'block';
    
    // Clear existing views
    viewsContainer.innerHTML = '';
    
    // Create new views
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.className = 'view-frame';
            viewsContainer.appendChild(iframe);
            
            if (i === count - 1) {
                setTimeout(() => progressPopup.style.display = 'none', 1000);
            }
        }, i * 500);
    }
}

// Close the popup when the user clicks on <span> (x)
document.querySelector('.close-popup').onclick = function() {
    document.getElementById('progress-popup').style.display = 'none';
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function addWebsiteView(url) {
    const viewsContainer = document.getElementById('views-container');
    
    const viewWrapper = document.createElement('div');
    viewWrapper.className = 'view-wrapper';
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'view-frame';
    iframe.title = 'Website View';
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => viewWrapper.remove();
    
    const viewNumber = document.createElement('span');
    viewNumber.className = 'view-number';
    viewNumber.textContent = `View ${viewsContainer.children.length + 1}`;
    
    viewWrapper.appendChild(viewNumber);
    viewWrapper.appendChild(iframe);
    viewWrapper.appendChild(removeBtn);
    viewsContainer.appendChild(viewWrapper);
}

// Theme handling
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Initialize theme on load
loadTheme();
