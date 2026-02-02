const toggle = document.getElementById('themeToggle');
const body = document.body;

toggle.addEventListener('click', () => {
    // 1. Bascule la classe active pour le déplacement de la pastille
    toggle.classList.toggle('active');

    // 2. Bascule le mode clair sur le body pour changer les variables
    body.classList.toggle('light-mode');

    // 3. Sauvegarde le choix
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Vérification au chargement
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    toggle.classList.add('active');
}

let texte = document.querySelector("h1");
let contenu = texte.innerHTML;
let curseur = document.querySelector(".cursor")
texte.innerHTML = '';

let index = 0;
let timer = setInterval(function () {
    if (index < contenu.length){
        texte.innerHTML += contenu.charAt(index);
        index++;
    }
    else{
        clearInterval(timer);
        curseur.style.display = "none";
    }
}, 150)