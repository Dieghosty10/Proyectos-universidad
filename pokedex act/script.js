
const listaPokemon = document.getElementById("listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const clearSearchBtn = document.getElementById("clear-search");
const navToggle = document.getElementById("navToggle");
const navWrapper = document.querySelector(".nav-wrapper");
const loader = document.getElementById("loader");
const content = document.getElementById("content");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Variables 
let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const pokemonPerPage = 20;
let totalPages = 0;
let isLoading = false;

// Inicio
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Iniciando carga de Pokémon...");
    loader.style.display = "flex";
    content.style.display = "none";
    
    try {
  
        if (!navigator.onLine) {
            throw new Error("No hay conexión a internet");
        }

        await loadAllPokemon();
        displayPokemonPage(1); // Mostrar Pokémon 
        
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.visibility = "hidden";
                content.style.display = "block";
            }, 300);
        }, 500);
    } catch (error) {
        console.error("Error al cargar Pokémon:", error);
        showError(error);
    }
});

// Mostrar error
function showError(error) {
    loader.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error al cargar los Pokémon: ${error.message}</p>
            <button onclick="window.location.reload()" class="btn btn-search">
                <i class="fas fa-sync-alt"></i> Recargar
            </button>
        </div>
    `;
}

// Cargar todos los Pokémon
async function loadAllPokemon() {
    isLoading = true;
    allPokemon = [];
    const totalPokemon = 151;
    
    try {
        for (let i = 1; i <= totalPokemon; i++) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                if (!response.ok) throw new Error(`Pokémon ${i} no disponible`);
                const data = await response.json();
                allPokemon.push(data);
                
              
                const percent = Math.round((i / totalPokemon) * 100);
                progressBar.style.width = `${percent}%`;
                progressText.textContent = `${percent}%`;
                
             
                await new Promise(resolve => setTimeout(resolve, 10));
            } catch (error) {
                console.error(`Error al cargar Pokémon ${i}:`, error);
            }
        }
        
        if (allPokemon.length === 0) {
            throw new Error("No se pudo cargar ningún Pokémon");
        }
        
        filteredPokemon = [...allPokemon];
        totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
        console.log(`Carga completada. ${allPokemon.length} Pokémon cargados.`);
    } finally {
        isLoading = false;
    }
}

// Mostrar página de Pokémon
function displayPokemonPage(page) {
    if (isLoading) return;
    
    currentPage = page;
    const startIndex = (page - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const pokemonToDisplay = filteredPokemon.slice(startIndex, endIndex);
    
    listaPokemon.innerHTML = "";
    
    pokemonToDisplay.forEach(pokemon => {
        createPokemonCard(pokemon);
    });
    
    updatePagination();
}

// Crear tarjeta de Pokémon
function createPokemonCard(poke) {
    const tipos = poke.types.map(type => 
        `<p class="${type.type.name} tipo">${type.type.name}</p>`
    ).join("");
    
    const pokeId = poke.id.toString().padStart(3, "0");
    const heightInMeters = poke.height / 10;
    const weightInKg = poke.weight / 10;
    
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default || 
                      poke.sprites.front_default}" 
                 alt="${poke.name}" 
                 loading="lazy">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat"><i class="fas fa-ruler-vertical"></i> ${heightInMeters}m</p>
                <p class="stat"><i class="fas fa-weight"></i> ${weightInKg}kg</p>
            </div>
        </div>
    `;
    
    div.addEventListener("click", () => showPokemonDetails(poke));
    listaPokemon.appendChild(div);
}


botonesHeader.forEach(boton => {
    boton.addEventListener("click", (event) => {
        const botonId = event.currentTarget.id;
        
        botonesHeader.forEach(btn => btn.classList.remove("active"));
        if (botonId !== "ver-todos") {
            event.currentTarget.classList.add("active");
        }
        
        if (botonId === "ver-todos") {
            filteredPokemon = [...allPokemon];
        } else {
            filteredPokemon = allPokemon.filter(pokemon => 
                pokemon.types.some(type => type.type.name.includes(botonId))
            );
        }
        
        currentPage = 1;
        totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
        displayPokemonPage(1);
    });
});

// Buscar Pokémon
async function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === "") {
        document.getElementById("ver-todos").click();
        clearSearchBtn.style.display = "none";
        return;
    }
    
    try {
        // Buscar en los Pokémon ya cargados primero
        const foundPokemon = allPokemon.find(pokemon => 
            pokemon.name.includes(searchTerm) || 
            pokemon.id.toString() === searchTerm
        );
        
        if (foundPokemon) {
            filteredPokemon = [foundPokemon];
            currentPage = 1;
            totalPages = 1;
            displayPokemonPage(1);
            clearSearchBtn.style.display = "flex";
            return;
        }
        
 
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        if (!response.ok) throw new Error("Pokémon no encontrado");
        
        const data = await response.json();
        filteredPokemon = [data];
        currentPage = 1;
        totalPages = 1;
        displayPokemonPage(1);
        clearSearchBtn.style.display = "flex";
        

        if (!allPokemon.some(p => p.id === data.id)) {
            allPokemon.push(data);
        }
    } catch (error) {
        console.error("Error en búsqueda:", error);
        listaPokemon.innerHTML = `
            <div class="no-results">
                <i class="fas fa-question-circle"></i>
                <p>No se encontró ningún Pokémon con "${searchTerm}"</p>
                <button onclick="document.getElementById('ver-todos').click()" class="btn btn-search">
                    <i class="fas fa-list"></i> Mostrar todos
                </button>
            </div>
        `;
        clearSearchBtn.style.display = "flex";
    }
}

// Limpiar búsqueda
function clearSearch() {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    document.getElementById("ver-todos").click();
}


function updatePagination() {
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

searchBtn.addEventListener("click", searchPokemon);
clearSearchBtn.addEventListener("click", clearSearch);

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchPokemon();
});

searchInput.addEventListener("input", () => {
    clearSearchBtn.style.display = searchInput.value.trim() === "" ? "none" : "flex";
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        displayPokemonPage(currentPage - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        displayPokemonPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

// menu en tlf
navToggle.addEventListener("click", () => {
    navWrapper.classList.toggle("active");
    navToggle.innerHTML = navWrapper.classList.contains("active") ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

//detalles del Pokémon
async function showPokemonDetails(pokemon) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'pokemon-modal';
    
    try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        const spanishEntry = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'es'
        );
        const description = spanishEntry ? 
            spanishEntry.flavor_text.replace(/\f/g, ' ') : 'Descripción no disponible';
        
        const statsHTML = pokemon.stats.map(stat => `
            <div class="stat-item">
                <div class="stat-label">${stat.stat.name.replace('-', ' ')}</div>
                <div class="stat-value">${stat.base_stat}</div>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: ${(stat.base_stat / 255) * 100}%"></div>
                </div>
            </div>
        `).join('');
        
        const abilitiesHTML = pokemon.abilities.map(ability => `
            <span class="ability">${ability.ability.name.replace('-', ' ')}${ability.is_hidden ? ' (hidden)' : ''}</span>
        `).join('');
        
        const movesHTML = pokemon.moves.slice(0, 5).map(move => `
            <span class="move">${move.move.name.replace('-', ' ')}</span>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header ${pokemon.types[0].type.name}">
                    <h2 class="modal-title">${pokemon.name}</h2>
                    <span class="modal-id">#${pokemon.id.toString().padStart(3, '0')}</span>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                             alt="${pokemon.name}"
                             class="pokemon-detail-img">
                    </div>
                    
                    <div class="modal-types">
                        ${pokemon.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join('')}
                    </div>
                    
                    <div class="modal-description">
                        <p>${description}</p>
                    </div>
                    
                    <div class="modal-details">
                        <div class="detail-item">
                            <h3>Altura</h3>
                            <p>${(pokemon.height / 10).toFixed(1)} m</p>
                        </div>
                        <div class="detail-item">
                            <h3>Peso</h3>
                            <p>${(pokemon.weight / 10).toFixed(1)} kg</p>
                        </div>
                        <div class="detail-item">
                            <h3>Habilidades</h3>
                            <div class="abilities">${abilitiesHTML}</div>
                        </div>
                        <div class="detail-item">
                            <h3>Experiencia base</h3>
                            <p>${pokemon.base_experience || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Estadísticas</h3>
                        <div class="modal-stats">${statsHTML}</div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Algunos Movimientos</h3>
                        <div class="modal-moves">${movesHTML}</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error al cargar detalles:", error);
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${pokemon.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Error al cargar los detalles del Pokémon</p>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => modal.style.opacity = '1', 10);
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}