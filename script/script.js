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