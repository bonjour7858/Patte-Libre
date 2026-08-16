const SUPABASE_URL = 'https://wedwqeblftbzfiuvhxee.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CgT8B1J92juKEl2wfvCxww_QQSQllTD'; // Remets bien ta clé ici !

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
    chargerAnimaux();
    initialiserFormulaire();
});

async function chargerAnimaux() {
    const { data, error } = await supabaseClient.from('animaux').select('*, refuges(*)');
    if (error) { console.error(error); return; }

    const grille = document.getElementById("animaux-grille");
    grille.innerHTML = "";

    data.forEach(animal => {
        const carte = document.createElement("div");
        carte.className = "bg-white rounded-xl shadow-md overflow-hidden";
        carte.innerHTML = `
            <img src="${animal.photo_url}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/400'">
            <div class="p-4">
                <h3 class="font-bold">${animal.nom}</h3>
                <p class="text-sm text-gray-600">${animal.race}</p>
                <p class="text-xs mt-2">${animal.description}</p>
            </div>
        `;
        grille.appendChild(carte);
    });
}

function initialiserFormulaire() {
    const form = document.getElementById("form-ajout-animal");
    const modal = document.getElementById("form-modal");
    
    document.getElementById("btn-ouvrir-form").addEventListener("click", () => modal.classList.remove("hidden"));
    document.getElementById("btn-fermer-form").addEventListener("click", () => modal.classList.add("hidden"));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // 1. Enregistrer le refuge
        const { data: refuge, error: errRefuge } = await supabaseClient
            .from('refuges')
            .insert([{ 
                nom: document.getElementById("refuge-nom").value,
                ville: document.getElementById("refuge-ville").value,
                telephone: document.getElementById("refuge-tel").value,
                email: document.getElementById("refuge-email").value
            }])
            .select().single();

        if (errRefuge) { alert("Erreur refuge"); return; }

        // 2. Enregistrer l'animal avec l'URL saisie
        const { error: errAnimal } = await supabaseClient.from('animaux').insert([{
            refuge_id: refuge.id,
            nom: document.getElementById("animal-nom").value,
            race: document.getElementById("animal-race").value,
            type: document.getElementById("animal-type").value,
            sous_cat: document.getElementById("animal-sous-cat").value,
            age: document.getElementById("animal-age").value,
            photo_url: document.getElementById("animal-photo-url").value,
            description: document.getElementById("animal-desc").value
        }]);

        if (errAnimal) { alert("Erreur animal"); }
        else {
            alert("Publié avec succès !");
            modal.classList.add("hidden");
            form.reset();
            chargerAnimaux();
        }
    });
}
