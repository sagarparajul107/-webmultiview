// Check if user is already onboarded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userOnboarded')) {
        window.location.href = 'index.html';
    }
});

function startApp() {
    localStorage.setItem('userOnboarded', 'true');
    window.location.href = 'index.html';
}