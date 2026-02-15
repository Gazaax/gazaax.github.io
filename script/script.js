
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

// Hover img
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let currentGallery = []; // Tableau des images du projet actuel
let currentIndex = 0;

document.querySelectorAll('.lien-conteneur-img').forEach(lien => {
    lien.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. On récupère la liste des images depuis l'attribut data-gallery
        const galleryData = lien.getAttribute('data-gallery');
        currentGallery = galleryData.split(','); // Transforme la chaîne en tableau

        currentIndex = 0; // On commence à la première image du projet
        updateLightbox();
        lightbox.classList.add('active');
    });
});

function updateLightbox() {
    lightboxImg.src = currentGallery[currentIndex];
}

// Bouton Suivant
document.querySelector('.next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentGallery.length > 1) {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox();
    }
});

// Bouton Précédent
document.querySelector('.prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentGallery.length > 1) {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    }
});

window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active') || currentGallery.length <= 1) return;

    if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox();
    } else if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    } else if (e.key === "Escape") {
        lightbox.classList.remove('active');
    }
});

// Fermer
lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

