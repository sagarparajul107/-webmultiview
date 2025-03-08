document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleDarkMode");
    const body = document.body;

    toggleButton.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
    });
});
