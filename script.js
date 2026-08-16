const SUPABASE_URL = 'https://wedwqeblftbzfiuvhxee.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CgT8B1J92juKEl2wfvCxww_QQSQllTD'; // Remets bien ta clé ici

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    chargerAnimaux();
    initialiserFormulaire();
});

async function chargerAnimaux() {
    const { data, error } = await supabaseClient.from('animaux').select('*, refuges(*)');
    if (error) { console.error(error); return; }

    const grille = document.getElementById("animaux-grille");
    if (!grille) return;
    grille.innerHTML = "";

    data.forEach(animal => {
        const carte = document.createElement("div");
        carte.className = "bg-white rounded-xl shadow-md overflow-hidden border border-gray-100";
        carte.innerHTML = `
            <img src="${animal.photo_url}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/400'">
            <div class="p-4">
                <span class="text-[10px] uppercase font-bold bg-teal-50 text-teal-600 px-2 py-0.5 rounded">${animal.type} • ${animal.sous_cat}</span>
                <h3 class="font-bold text-lg mt-1">${animal.nom}</h3>
                <p class="text-sm text-gray-600">${animal.race} (${animal.age})</p>
                <p class="text-xs text-gray-500 mt-2 line-clamp-2">${animal.description}</p>
            </div>
        `;
        grille.appendChild(carte);
    });
}

function initialiserFormulaire() {
    const form = document.getElementById("form-ajout-animal");
    const modal = document.getElementById("form-modal");
    const btnOuvrir = document.getElementById("btn-ouvrir-form");
    const btnFermer = document.getElementById("btn-fermer-form");

    if (!form || !modal) return;

    if (btnOuvrir) btnOuvrir.addEventListener("click", () => modal.classList.remove("hidden"));
    if (btnFermer) btnFermer.addEventListener("click", () => modal.classList.add("hidden"));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Sécurité anti-crash : vérification que les éléments existent bien
        const nomAnimal = document.getElementById("animal-nom")?.value;
        const raceAnimal = document.getElementById("animal-race")?.value;
        const typeAnimal = document.getElementById("animal-type")?.value;
        const sousCatAnimal = document.getElementById("animal-sous-cat")?.value;
        const ageAnimal = document.getElementById("animal-age")?.value;
        const photoUrl = document.getElementById("animal-photo-url")?.value;
        const descAnimal = document.getElementById("animal-desc")?.value;

        const nomRefuge = document.getElementById("refuge-nom")?.value;
        const villeRefuge = document.getElementById("refuge-ville")?.value;
        const telRefuge = document.getElementById("refuge-tel")?.value;
        const emailRefuge = document.getElementById("refuge-email")?.value;

        if (!nomAnimal || !photoUrl || !nomRefuge) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // 1. Enregistrer le refuge
        const { data: refuge, error: errRefuge } = await supabaseClient
            .from('refuges')
            .insert([{ 
                nom: nomRefuge,
                ville: villeRefuge,
                telephone: telRefuge,
                email: emailRefuge
            }])
            .select().single();

        if (errRefuge) { 
            alert("Erreur refuge : " + errRefuge.message); 
            return; 
        }

        // 2. Enregistrer l'animal
        const { error: errAnimal } = await supabaseClient.from('animaux').insert([{
            refuge_id: refuge.id,
            nom: nomAnimal,
            race: raceAnimal,
            type: typeAnimal,
            sous_cat: sousCatAnimal,
            age: ageAnimal,
            photo_url: photoUrl,
            description: descAnimal
        }]);

        if (errAnimal) { 
            alert("Erreur animal : " + errAnimal.message); 
        } else {
            alert("Annonce publiée avec succès ! 🎉");
            modal.classList.add("hidden");
            form.reset();
            chargerAnimaux();
        }
    });
}
