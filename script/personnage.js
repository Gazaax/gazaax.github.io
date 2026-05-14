const heroChar = document.getElementById('hero-char');
const heroSection = document.getElementById('hero');

document.addEventListener('mousemove', (e) => {

    const rect = heroSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const xRel = (e.clientX / window.innerWidth  - 0.5)*2;
    const yRel = (e.clientY / window.innerHeight - 0.5)*2;

    heroChar.style.transform = `translateX(${xRel * 18}px) translateY(${yRel * 10}px)`;
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    // Close menu when a link is clicked (for single-page navigation)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });
}