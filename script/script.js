
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

window.addEventListener('scroll', () => {
    const container = document.querySelector('.timeline-container');
    const progressBar = document.querySelector('.timeline-progress-bar');
    const items = document.querySelectorAll('.timeline-item');
    const lastItem = document.querySelector('.timeline-list'); // Utilise la liste pour le point final

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Seuil de déclenchement : l'animation commence quand le conteneur 
    // est à 80% du bas de l'écran (plus tôt qu'avant)
    const triggerPoint = windowHeight * 0.8;

    // On calcule la distance parcourue depuis le haut du conteneur
    const distanceScrolled = triggerPoint - rect.top;

    // On convertit en pourcentage (0 à 100)
    // On ajoute un petit multiplicateur (ex: 1.2) si on veut que la ligne 
    // descende un peu plus vite que le scroll
    let progress = (distanceScrolled / rect.height) * 100;

    // Sécurité pour rester entre 0 et 100%
    progress = Math.max(0, Math.min(100, progress));

    progressBar.style.height = `${progress}%`;

    // Révélation des items
    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.85) { // Seuil d'apparition du texte
            item.classList.add('revealed');
        }
    });
});

