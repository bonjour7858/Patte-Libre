// DONNÉES DE TEST GLOBALES (type: 'chien', 'chat', etc. et sous_cat: 'bebe', 'adulte', 'sos')
const mockData = [
    { 
        id: 1, 
        type: "chien",
        sous_cat: "adulte",
        nom: "Rex", 
        race: "Berger Allemand", 
        age: "3 ans", 
        refuge: "SPA de Paris (Gennevilliers)", 
        photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600", 
        info: "Un chien très joueur, adore les balades.", 
        url_officiel: "#" 
    },
    { 
        id: 2, 
        type: "chien",
        sous_cat: "sos",
        nom: "Max", 
        race: "Croisé Lab", 
        age: "8 ans", 
        refuge: "SPA de Lyon", 
        photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600", 
        info: "Urgent : Chien âgé cherchant une famille calme pour sa retraite.", 
        url_officiel: "#" 
    },
    { 
        id: 3, 
        type: "chat",
        sous_cat: "bebe",
        nom: "Mina", 
        race: "Chat Européen", 
        age: "3 mois", 
        refuge: "SPA de Marseille", 
        photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", 
        info: "Adorable chatton plein d'énergie.", 
        url_officiel: "#" 
    }
];

let filtreActuel = 'tous';

function chargerGrille() {
    const grid = document.getElementById('animaux-grid');
    if (!grid) return; // Si on est sur la page d'accueil sans grille, on s'arrête

    grid.innerHTML = "";

    // Filtrer les données selon la page (ex: que les chiens) et selon le bouton cliqué (tous, bebe, adulte, sos)
    const animauxFiltres = mockData.filter(a => {
        const correspondCategorie = a.type === CATEGORIE_PAGE;
        const correspondSousCat = filtreActuel === 'tous' || a.sous_cat === filtreActuel;
        return correspondCategorie && correspondSousCat;
    });

    if (animauxFiltres.length === 0) {
        grid.innerHTML = `<p class="text-slate-400 text-sm col-span-full text-center py-12">Aucun animal trouvé dans cette catégorie pour le moment.</p>`;
        return;
    }

    animauxFiltres.forEach(a => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-3xl border border-slate-200/80 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col relative";
        card.onclick = () => ouvrirModal(a);
        
        let badgeSos = a.sous_cat === 'sos' ? `<span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">🚨 SOS</span>` : '';

        card.innerHTML = `
            <div class="relative h-56 overflow-hidden">
                <img src="${a.photo}" alt="${a.nom}" class="w-full h-full object-cover transition duration-500 hover:scale-105">
                ${badgeSos}
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">${a.age}</span>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-slate-900 mb-1">${a.nom}</h3>
                <p class="text-indigo-600 text-sm font-semibold mb-3">${a.race}</p>
                <p class="text-slate-400 text-xs font-medium mt-auto flex items-center gap-1">📍 ${a.refuge}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filtrerSousCategorie(sousCat) {
    filtreActuel = sousCat;

    // Gestion visuelle des boutons actifs
    const boutons = document.querySelectorAll('.filtre-btn');
    boutons.forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-600');
    });

    // Mettre en avant le bouton cliqué
    event.target.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-600');
    event.target.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');

    chargerGrille();
}

function ouvrirModal(a) {
    document.getElementById('modal-img').src = a.photo;
    document.getElementById('modal-nom').textContent = a.nom;
    document.getElementById('modal-race').textContent = a.race;
    document.getElementById('modal-age').textContent = a.age;
    document.getElementById('modal-refuge').textContent = a.refuge;
    document.getElementById('modal-info').textContent = a.info;
    document.getElementById('modal-lien').href = a.url_officiel;
    
    const modal = document.getElementById('modal');
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
}

function fermerModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto';
}

// Lancement au chargement si on est sur une page de grille
chargerGrille();
