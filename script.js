// script.js — Logique fonctionnelle complète et robuste

document.addEventListener('DOMContentLoaded', () => {
    console.log("Patte Libre — Système initialisé avec succès.");

    // 1. Gestion du Dark Mode / Light Mode
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Charger la préférence sauvegardée si elle existe
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            themeToggle.textContent = '☀️';
        }
    }

    // 2. Gestion des filtres rapides interactifs
    const filterButtons = document.querySelectorAll('.filter-badge');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Si ce n'est pas le bouton SOS, on gère l'alternance standard
            if (!btn.classList.contains('bg-red-500')) {
                filterButtons.forEach(b => {
                    if (!b.classList.contains('bg-red-500')) {
                        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
                        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
                    }
                });
                
                btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
                btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
            }
        });
    });

    // 3. Simulation de clic sur les cartes de catégories
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('h2').textContent;
            console.log(`Catégorie sélectionnée : ${categoryName}`);
            // Effet visuel rapide de sélection
            card.classList.add('ring-2', 'ring-indigo-500');
            setTimeout(() => {
                card.classList.remove('ring-2', 'ring-indigo-500');
            }, 300);
        });
    });
});
