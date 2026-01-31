const toggle = document.getElementById('themeToggle');
const body = document.body;

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    body.classList.toggle('light-mode');
});