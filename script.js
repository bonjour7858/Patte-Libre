const mockData = [
    { 
        id: 1, type: "chien", sous_cat: "adulte", refugeNom: "Refuge de Paris (Gennevilliers)",
        nom: "Rex", race: "Berger Allemand", age: "3 ans", 
        photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600", 
        info: "Un chien très joueur, adore les balades et l'eau.", url_officiel: "#" 
    },
    { 
        id: 2, type: "chien", sous_cat: "sos", refugeNom: "Refuge de Lyon",
        nom: "Max", race: "Croisé Labrador", age: "8 ans", 
        photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600", 
        info: "Urgent : Chien âgé cherchant une famille calme et un panier douillet.", url_officiel: "#" 
    },
    { 
        id: 3, type: "chat", sous_cat: "bebe", refugeNom: "Refuge de Marseille",
        nom: "Mina", race: "Chat Européen", age: "3 mois", 
        photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", 
        info: "Adorable chaton plein d'énergie et très câlin.", url_officiel: "#" 
    },
    { 
        id: 4, type: "nac", sous_cat: "bebe", refugeNom: "Refuge de Lille",
        nom: "Panpan", race: "Lapin Bélier", age: "4 mois", 
        photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600", 
        info: "Jeune lapin curieux, propre et habitué aux manipulations en douceur.", url_officiel: "#" 
    },
    { 
        id: 5, type: "ferme", sous_cat: "adulte", refugeNom: "Refuge de Toulouse",
        nom: "Biquette", race: "Chèvre Naine", age: "2 ans", 
        photo: "https://images.unsplash.com/photo-1524024973431-2ad967745867?w=600", 
        info: "Habituée aux grands espaces, très sociable avec les autres animaux.", url_officiel: "#" 
    }
];

let filtreActuel = 'tous';
let rechercheTexte = '';
let refugeActuel = 'tous';

// Initialisation au chargement de chaque page
document.addEventListener("DOMContentLoaded", () => {
    // Vérification de la préférence du mode sombre stockée
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
    }
    initialiserInterface();
    chargerGrille();
});

// Basculer et mémoriser le mode sombre
function basculerDarkMode() {
    if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}

// Charger et filtrer la grille des animaux selon tous les critères
function chargerGrille() {
    const grid = document.getElementById('animaux-grid');
    if (!grid) return;

    grid.innerHTML = "";

    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];

    const animauxFiltres = mockData.filter(a => {
        const correspondCategorie = typeof CATEGORIE_PAGE !== 'undefined' && a.type === CATEGORIE_PAGE;
        const correspondSousCat = filtreActuel === 'tous' || a.sous_cat === filtreActuel;
        const correspondRefuge = refugeActuel === 'tous' || a.refugeNom === refugeActuel;
        
        const texteRecherche = (a.nom + " " + a.race).toLowerCase();
        const correspondRecherche = texteRecherche.includes(rechercheTexte.toLowerCase());

        return correspondCategorie && correspondSousCat && correspondRefuge && correspondRecherche;
    });

    if (animauxFiltres.length === 0) {
        grid.innerHTML = `<p class="text-slate-400 dark:text-slate-500 text-sm col-span-full text-center py-12">Aucun animal trouvé avec ces critères.</p>`;
        return;
    }

    animauxFiltres.forEach(a => {
        const estFavori = favoris.includes(a.id);
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col relative";
        
        let badgeSos = a.sous_cat === 'sos' ? `<span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse z-10">🚨 SOS</span>` : '';

        card.innerHTML = `
            <div class="relative h-56 overflow-hidden">
                <img src="${a.photo}" alt="${a.nom}" class="w-full h-full object-cover transition duration-500 hover:scale-105">
                ${badgeSos}
                <button onclick="event.stopPropagation(); toggleFavori(${a.id})" class="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-110 transition z-10">
                    <span class="text-lg">${estFavori ? '❤️' : '🤍'}</span>
                </button>
                <span class="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm">${a.age}</span>
            </div>
            <div class="p-5 flex flex-col flex-grow" onclick="ouvrirModalById(${a.id})">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">${a.nom}</h3>
                <p class="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3">${a.race}</p>
                <p class="text-slate-400 dark:text-slate-500 text-xs font-medium mt-auto flex items-center gap-1">📍 ${a.refugeNom}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Gestion des filtres de sous-catégories (Tous, Bébés, Adultes, SOS)
function filtrerSousCategorie(sousCat) {
    filtreActuel = sousCat;
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'dark:bg-slate-900', 'border', 'border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-300');
    });
    event.target.classList.remove('bg-white', 'dark:bg-slate-900', 'border', 'border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-300');
    event.target.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
    chargerGrille();
}

// Recherche textuelle instantanée
function filtrerRecherche(event) {
    rechercheTexte = event.target.value;
    chargerGrille();
}

// Filtrage par refuge sélectionné
function filtrerRefuge(event) {
    refugeActuel = event.target.value;
    chargerGrille();
}

// Gestion des favoris avec persistance dans le localStorage
function toggleFavori(id) {
    let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    if (favoris.includes(id)) {
        favoris = favoris.filter(favId => favId !== id);
    } else {
        favoris.push(id);
    }
    localStorage.setItem('favoris', JSON.stringify(favoris));
    chargerGrille();
}

// Peuplement automatique du menu déroulant des refuges
function initialiserInterface() {
    const selectRefuge = document.getElementById('refuge-select');
    if (selectRefuge) {
        const refugesUniques = [...new Set(mockData.map(a => a.refugeNom))];
        refugesUniques.forEach(refuge => {
            const option = document.createElement('option');
            option.value = refuge;
            option.textContent = refuge;
            selectRefuge.appendChild(option);
        });
    }
}

// Ouverture de la modale détaillée pour un animal
function ouvrirModalById(id) {
    const a = mockData.find(item => item.id === id);
    if (!a) return;

    document.getElementById('modal-img').src = a.photo;
    document.getElementById('modal-nom').textContent = a.nom;
    document.getElementById('modal-race').textContent = a.race;
    document.getElementById('modal-age').textContent = a.age;
    document.getElementById('modal-refuge').textContent = a.refugeNom;
    document.getElementById('modal-info').textContent = a.info;
    document.getElementById('modal-lien').href = a.url_officiel;
    
    const modal = document.getElementById('modal');
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
}

// Fermeture de la modale détaillée
function fermerModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto';
}
