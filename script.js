document.addEventListener('DOMContentLoaded', () => {
    loadAnimals();

    // Thème
    document.getElementById('themeToggle').addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('themeToggle').textContent = '☀️';
    }

    let currentCategory = null;
    let currentSubCategory = 'tous';

    // Gestion du clic sur les grandes catégories
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const selectedCategory = card.getAttribute('data-category');
            const isAlreadyActive = card.classList.contains('ring-2');
            
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('ring-2', 'ring-indigo-500'));
            
            if (isAlreadyActive) {
                currentCategory = null;
            } else {
                card.classList.add('ring-2', 'ring-indigo-500');
                currentCategory = selectedCategory;
            }
            loadAnimals(currentCategory, currentSubCategory);
        });
    });

    // Gestion du clic sur les sous-catégories (bébés, adultes, SOS)
    document.querySelectorAll('.sub-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sub-category-btn').forEach(b => b.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-950'));
            btn.classList.add('ring-2', 'ring-indigo-500');
            
            currentSubCategory = btn.getAttribute('data-sub');
            loadAnimals(currentCategory, currentSubCategory);
        });
    });

    // Modals Ajout
    const openAdd = () => { const m = document.getElementById('addAnimalModal'); m.classList.remove('hidden'); m.classList.add('flex'); };
    const closeAdd = () => { const m = document.getElementById('addAnimalModal'); m.classList.remove('flex'); m.classList.add('hidden'); };
    document.getElementById('navAddBtn').addEventListener('click', openAdd);
    document.getElementById('heroAddBtn').addEventListener('click', openAdd);
    document.getElementById('closeAddModal').addEventListener('click', closeAdd);

    // Modals Gestion
    const openManage = () => { loadManageList(); const m = document.getElementById('manageAnimalsModal'); m.classList.remove('hidden'); m.classList.add('flex'); };
    const closeManage = () => { const m = document.getElementById('manageAnimalsModal'); m.classList.remove('flex'); m.classList.add('hidden'); };
    document.getElementById('navManageBtn').addEventListener('click', openManage);
    document.getElementById('heroManageBtn').addEventListener('click', openManage);
    document.getElementById('closeManageModal').addEventListener('click', closeManage);

    // Modals Login
    const openLogin = () => { const m = document.getElementById('loginModal'); m.classList.remove('hidden'); m.classList.add('flex'); };
    const closeLogin = () => { const m = document.getElementById('loginModal'); m.classList.remove('flex'); m.classList.add('hidden'); };
    document.getElementById('loginBtn').addEventListener('click', openLogin);
    document.getElementById('closeLoginModal').addEventListener('click', closeLogin);
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Connexion réussie !");
        closeLogin();
    });

    // Formulaire Ajout
    document.getElementById('addAnimalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newAnimal = {
            id: Date.now(),
            name: document.getElementById('animalName').value,
            age: document.getElementById('animalAge').value,
            breed: document.getElementById('animalBreed').value,
            shelter: document.getElementById('animalShelter').value,
            image: document.getElementById('animalImage').value,
            link: document.getElementById('animalLink').value,
            desc: document.getElementById('animalDesc').value,
            category: "Chiens", // Valeur par défaut
            subCategory: "adultes" // Valeur par défaut
        };

        let animals = JSON.parse(localStorage.getItem('patteLibreAnimals')) || [];
        animals.unshift(newAnimal);
        localStorage.setItem('patteLibreAnimals', JSON.stringify(animals));

        loadAnimals(currentCategory, currentSubCategory);
        closeAdd();
        e.target.reset();
        alert("Annonce publiée avec succès !");
    });
});

window.deleteAnimal = function(id) {
    if(confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
        let animals = JSON.parse(localStorage.getItem('patteLibreAnimals')) || [];
        animals = animals.filter(a => a.id !== id);
        localStorage.setItem('patteLibreAnimals', JSON.stringify(animals));
        loadAnimals();
        loadManageList();
    }
};

function loadManageList() {
    const listContainer = document.getElementById('manageAnimalsList');
    let animals = JSON.parse(localStorage.getItem('patteLibreAnimals')) || [];

    if(animals.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-xs text-slate-400 py-4">Aucune annonce personnalisée pour le moment.</p>`;
        return;
    }

    let html = '';
    animals.forEach(animal => {
        html += `
            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div class="flex items-center space-x-3">
                    <img src="${animal.image}" class="w-12 h-12 rounded-xl object-cover" alt="${animal.name}">
                    <div>
                        <h4 class="font-bold text-sm text-slate-900 dark:text-white">${animal.name}</h4>
                        <p class="text-xs text-slate-500">${animal.breed} — ${animal.shelter}</p>
                    </div>
                </div>
                <button onclick="deleteAnimal(${animal.id})" class="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-950/50 dark:text-red-400 text-xs font-semibold cursor-pointer">
                    Supprimer
                </button>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

function loadAnimals(filterCategory = null, filterSub = 'tous') {
    const grid = document.getElementById('animalsGrid');
    if (!grid) return;
    
    let defaultAnimals = [
        {
            id: 'default-1',
            name: 'Rex',
            age: '3 ans',
            breed: 'Berger Allemand',
            shelter: "Refuge de Paris (Gennevilliers)",
            image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
            link: "#",
            desc: "Un chien très joueur, adore les balades et l'eau.",
            category: "Chiens",
            subCategory: "adultes"
        }
    ];

    let customAnimals = JSON.parse(localStorage.getItem('patteLibreAnimals')) || [];
    let allAnimals = [...defaultAnimals, ...customAnimals];

    // Filtrage grande catégorie
    if (filterCategory) {
        allAnimals = allAnimals.filter(a => a.category === filterCategory);
    }

    // Filtrage sous-catégorie (bébés, adultes, sos)
    if (filterSub && filterSub !== 'tous') {
        allAnimals = allAnimals.filter(a => a.subCategory === filterSub);
    }

    if (allAnimals.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400 text-sm">Aucun pensionnaire trouvé pour cette sélection.</div>`;
        return;
    }

    let html = '';
    allAnimals.forEach(animal => {
        html += `
            <div class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg animal-card">
                <div class="relative h-64 bg-slate-900">
                    <img src="${animal.image}" alt="${animal.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div class="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">${animal.age}</div>
                    <div class="absolute bottom-4 left-4 text-white">
                        <h3 class="text-2xl font-black tracking-wide">${animal.name}</h3>
                    </div>
                </div>
                <div class="p-6">
                    <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${animal.breed}</span>
                    <div class="mt-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Refuge d'accueil</p>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">${animal.shelter}</p>
                    </div>
                    <div class="mt-4">
                        <p class="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">À propos</p>
                        <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">${animal.desc}</p>
                    </div>
                    <a href="${animal.link}" target="_blank" class="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center space-x-2">
                        <span>Voir l'annonce officielle</span>
                        <span>↗</span>
                    </a>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}
