
// Toggle switch
const toggle = document.getElementById('themeToggle');
const body = document.body;

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');

    body.classList.toggle('light-mode');

    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    toggle.classList.add('active');
}

//nav barre qui apparait et disparait
let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
        header.classList.remove("hidden");
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains("hidden")) {
        header.classList.add("hidden");
    }
    else if (currentScroll < lastScroll && header.classList.contains("hidden")) {
        header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
});

// Hero title
let texte = document.querySelector("h1");
let contenu = texte.innerHTML;
texte.innerHTML = '';

let index = 0;
let timer = setInterval(function () {
    if (index < contenu.length){
        texte.innerHTML += contenu.charAt(index);
        index++;
    }
    else{
        clearInterval(timer);
        const heroSection = document.querySelector('.hero-section');
        heroSection.classList.add('start-fade') 
    }
}, 80);

// Swiper
if (document.querySelector('.swiper')) {
    new Swiper('.swiper', {
        loop: true,
        pagination: { el: '.swiper-pagination' ,
        clickable: true,
        dynamicBullets: false,},
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}