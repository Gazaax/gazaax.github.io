const bars = document.querySelectorAll('.skill-bar-fill');
const skillItems = document.querySelectorAll('.skill-item');
let skillsAnimated = false;


const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillItems.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('lit');
                const bar = item.querySelector('.skill-bar-fill');
                if (bar) {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width + '%';
                    }, 100);
                }
            }, i * 120);
        });
    }
}, { threshold: 0.2 });
skillObserver.observe(skillsSection);
