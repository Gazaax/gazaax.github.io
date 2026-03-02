
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
// AOS
if (typeof AOS !== 'undefined' && document.querySelector('[data-aos]')) {
    AOS.init();
}
// Hover img
const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let currentGallery = [];
let currentIndex = 0;

function updateLightbox() {
    lightboxImg.src = currentGallery[currentIndex];
}

function toggleNavigationArrows(){
    if (currentGallery.length <= 1){
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }else{
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

document.querySelectorAll('.lien-conteneur-img').forEach(lien => {
    lien.addEventListener('click', (e) => {
        e.preventDefault();

        const galleryData = lien.getAttribute('data-gallery');
        currentGallery = galleryData.split(',');

        currentIndex = 0;
        toggleNavigationArrows()
        updateLightbox();
        lightbox.classList.add('active');
    });
});

// Bouton Suivant
 nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentGallery.length > 1) {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        toggleNavigationArrows();
        updateLightbox();
    }
});

// Bouton Précédent
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentGallery.length > 1) {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        toggleNavigationArrows()
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

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const triggerPoint = windowHeight * 0.8;

    const distanceScrolled = triggerPoint - rect.top;

    let progress = (distanceScrolled / rect.height) * 100;

    progress = Math.max(0, Math.min(100, progress));

    progressBar.style.height = `${progress}%`;

    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.85) {
            item.classList.add('revealed');
        }
    });
});

const bars = document.querySelectorAll('.progress-bar');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

bars.forEach(bar => observer.observe(bar));

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});


