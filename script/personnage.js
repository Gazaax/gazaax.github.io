const heroChar = document.getElementById('hero-char');

document.addEventListener('mousemove', e => {
    const rect = document.getElementById('hero').getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {

        const xRel = (e.clientX / window.innerWidth - 0.5) * 2;
        const yRel = (e.clientY / window.innerHeight - 0.5) * 2;

        heroChar.style.transform = `
      translateX(calc(-50% +${xRel * 14}px))
      translateY(${yRel * 8}px)
    `;
    }
}) ;