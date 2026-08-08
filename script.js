// script.js - Logique interactive pour Patte Libre

document.asReady = (callback) => {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

document.asReady(() => {
    console.log("Patte Libre — Système initialisé avec succès.");

    // Gestion du thème sombre / clair (toggle basique)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }

    // Animation ou interaction sur les cartes de catégories
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0px)';
        });
    });

    // Gestion des filtres rapides (Bébés, Adultes, SOS, etc.)
    const filterButtons = document.querySelectorAll('.filter-badge');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterButtons.forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
            filterButtons.forEach(b => b.classList.add('bg-slate-100', 'text-slate-600'));
            
            btn.classList.remove('bg-slate-100', 'text-slate-600');
            btn.classList.add('bg-indigo-600', 'text-white');
        });
    });
});
