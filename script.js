const mockData = [
    { 
        id: 1, 
        nom: "Rex", 
        race: "Berger Allemand", 
        age: "3 ans", 
        refuge: "SPA de Paris (Gennevilliers)", 
        photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600", 
        info: "Un chien très joueur, adore les balades en plein air et s'entend très bien avec ses congénères femelles. Idéal pour une famille active.", 
        url_officiel: "#" 
    },
    { 
        id: 2, 
        nom: "Mina", 
        race: "Chat Européen", 
        age: "1 an", 
        refuge: "SPA de Lyon (Marennes)", 
        photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", 
        info: "Une chatte calme, extrêmement câline et propre. Elle apprécie la tranquillité et sera parfaite pour la vie en appartement.", 
        url_officiel: "#" 
    }
];

function chargerGrille() {
    const grid = document.getElementById('animaux-grid');
    grid.innerHTML = "";

    mockData.forEach(a => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-3xl border border-slate-200/80 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col";
        card.onclick = () => ouvrirModal(a);
        
        card.innerHTML = `
            <div class="relative h-56 overflow-hidden">
                <img src="${a.photo}" alt="${a.nom}" class="w-full h-full object-cover transition duration-500 hover:scale-105">
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
    document.body.style.overflow = 'hidden'; // Bloquer le scroll en arrière-plan
}

function fermerModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto'; // Réactiver le scroll
}

chargerGrille();
