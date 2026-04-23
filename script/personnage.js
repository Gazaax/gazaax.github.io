const heroChar = document.getElementById('hero-char');
const heroSection = document.getElementById('hero');

document.addEventListener('mousemove', (e) => {

    const rect = heroSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const xRel = (e.clientX / window.innerWidth  - 0.5)*2;
    const yRel = (e.clientY / window.innerHeight - 0.5)*2;

    heroChar.style.transform = `translateX(${xRel * 18}px) translateY(${yRel * 10}px)`;
});