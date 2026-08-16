// ==========================================
// CONFIGURATION SUPABASE
// ==========================================
const SUPABASE_URL = 'https://wedwqeblftbzfiuvhxee.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CgT8B1J92juKEl2wfvCxww_QQSQllTD';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variables d'état
let filtreTypeActuel = 'tous';       
let filtreSousCatActuelle = 'tous';  
let mockData = [];                   

document.addEventListener("DOMContentLoaded", async () => {
    // Chargement des données depuis Supabase
    const { data, error } = await supabase
        .from('animaux')
        .select(`
            id,
            nom,
            race,
            type,
            sous_cat,
            age,
            photo_url,
            description,
            refuges (
                nom,
                ville,
                departement,
                telephone,
                email
            )
        `);

    if (error) {
        console.error("Erreur de chargement Supabase :", error);
    } else {
        mockData = data.map(item => ({
            id: item.id,
            type: (item.type || '').toLowerCase().trim(),
            sous_cat: (item.sous_cat || '').toLowerCase().trim(),
            nom: item.nom,
            race: item.race || 'Race non spécifiée',
            age: item.age || 'Âge non renseigné',
            photo: item.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600',
            info: item.description || 'Aucune description fournie.',
            refugeNom: item.refuges?.nom || "Refuge indépendant",
            refugeVille: item.refuges?.ville || "Ville non renseignée",
            refugeTel: item.refuges?.telephone || "Non communiqué",
            refugeEmail: item.refuges?.email || "Non communiqué"
        }));
    }

    initialiserInterface();
    chargerGrille();
});

function chargerGrille() {
    const grille = document.getElementById("animaux-grille");
    if (!grille) return;

    grille.innerHTML = "";

    const donneesFiltrees = mockData.filter(animal => {
        const correspondType = (filtreTypeActuel === 'tous' || animal.type === filtreTypeActuel);
        const correspondSousCat = (filtreSousCatActuelle === 'tous' || animal.sous_cat === filtreSousCatActuelle);
        return correspondType && correspondSousCat;
    });

    if (donneesFiltrees.length === 0) {
        grille.innerHTML = `<p class="text-center col-span-full py-12 text-gray-500">Aucun animal ne correspond à cette recherche pour le moment.</p>`;
        return;
    }

    donneesFiltrees.forEach(animal => {
        const carte = document.createElement("div");
        carte.className = "animal-card";
        
        carte.innerHTML = `
            <div>
                <div class="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img src="${animal.photo}" alt="${animal.nom}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase shadow">
                        ${animal.sous_cat}
                    </span>
                </div>
                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">${animal.nom}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">${animal.race}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">🎂 ${animal.age}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-2">${animal.info}</p>
                </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                <div class="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-3">📍 ${animal.refugeNom} (${animal.refugeVille})</div>
                <div class="flex gap-2">
                    <a href="tel:${animal.refugeTel}" class="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition shadow-sm">
                        📞 Appeler
                    </a>
                    <a href="mailto:${animal.refugeEmail}" class="flex-1 text-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-xs font-bold py-2 px-3 rounded-lg transition">
                        ✉️ E-mail
                    </a>
                </div>
            </div>
        `;
        grille.appendChild(carte);
    });
}

function initialiserInterface() {
    // Boutons de type
    const boutonsType = document.querySelectorAll("[data-type]");
    boutonsType.forEach(btn => {
        btn.addEventListener("click", (e) => {
            boutonsType.forEach(b => b.classList.remove("active-filter"));
            e.currentTarget.classList.add("active-filter");
            filtreTypeActuel = e.currentTarget.getAttribute("data-type");
            chargerGrille();
        });
    });

    // Boutons de sous-catégorie
    const boutonsSousCat = document.querySelectorAll("[data-sous-cat]");
    boutonsSousCat.forEach(btn => {
        btn.addEventListener("click", (e) => {
            boutonsSousCat.forEach(b => b.classList.remove("active-filter"));
            e.currentTarget.classList.add("active-filter");
            filtreSousCatActuelle = e.currentTarget.getAttribute("data-sous-cat");
            chargerGrille();
        });
    });
}
