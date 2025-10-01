let allPokemons = [];
let currentPokemons = [];
let pokemonTypesCache = {};
let currentOffset = 0;
const limit = 40;
let currentPokemonId = null;
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const pokemonGallery = document.querySelector("#pokemonGallery");
const notFoundMessage = document.querySelector("#notFoundMessage");
const errorMessage = document.querySelector("#errorMessage");
const loadMoreButton = document.querySelector("#loadMoreButton");
const loadingSpinner = document.querySelector("#loadingSpinner");

fetch("https://pokeapi.co/api/v2/pokemon?limit=40&offset=0")
    .then((response) => response.json())
    .then((data) => {
        const pokemonPromises = data.results.map(
            (pokemon) => fetch(pokemon.url)
                .then((response) => response.json())
                .then((pokemonDetails) => pokemonDetails)
        );
        Promise.all(pokemonPromises).then((pokemons) => {
            allPokemons = pokemons;
            currentPokemons = allPokemons;
            renderPokemonCardsGallery();
        });
    })
    .catch((error) => console.error("Fehler beim Abrufen der Pokémon:", error)
);

function loadPokemons(offset) {
    showLoadingSpinner();
    loadMoreButton.disabled = true;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        .then((response) => response.json())
        .then((data) => {
            const pokemonPromises = data.results.map((pokemon) =>
                fetch(pokemon.url)
                    .then((response) => response.json())
                    .then((pokemonDetails) => pokemonDetails)
            );
            Promise.all(pokemonPromises).then((pokemons) => {
                allPokemons = [...allPokemons, ...pokemons];
                currentPokemons = allPokemons;
                renderPokemonCardsGallery();
                hideLoadingSpinner();
                loadMoreButton.disabled = false;
            });
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen der Pokémon:", error);
            hideLoadingSpinner();
            loadMoreButton.disabled = false;
        });
}

function renderPokemonCardsGallery() {
    clearGallery();
    if (currentPokemons.length === 0) {
        showNotFoundMessage();
        return;
    } else {
        hideNotFoundMessage();
    }
    currentPokemons.forEach((pokemon) => {
        const pokemonCard = createPokemonCard(pokemon);
        pokemonCard.addEventListener("click", () =>
            handleCardClick(pokemonCard, pokemon)
        );
        pokemonGallery.appendChild(pokemonCard);
    });
}

function clearGallery() {
    pokemonGallery.innerHTML = "";
}

function showNotFoundMessage() {
    notFoundMessage.style.display = "block";
}

function hideNotFoundMessage() {
    notFoundMessage.style.display = "none";
}

function createPokemonCard(pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    const cardBackgroundColor = getBackgroundColorByType(pokemon.types);
    pokemonCard.innerHTML =` 
        <div class="pokemon-card" style="background-color: ${cardBackgroundColor};">
            <div class="card-header" >
                <span class="card-header-nb"># ${pokemon.id}</span>
                <span class="card-header-txt">${pokemon.name}</span>
            </div>
            <div class="card-img-container">
                <img class="card-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
            </div>
            <div class="details-types-container">
                ${pokemon.types.map((type) =>`<button class="pokemon-type-button" style="background-color: ${getBackgroundColorByType([type])};">${type.type.name}</button>`).join("")}
            </div>
        </div>
    `;
    return pokemonCard;
}

function showPokemonDetailsById(pokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => response.json())
    .then((data) => displayPokemonDetails(data))
    .catch((error) => { console.error("Fehler beim Abrufen der Pokémon-Details:", error);
    });
}

function displayPokemonDetails(data) {
    let contentGallery = document.querySelector("#contentGallery");
    contentGallery = createOverlayIfNeeded(contentGallery);
    const backgroundColor = getBackgroundColorByType(data.types);

    contentGallery.innerHTML = generatePokemonDetailsHTMLTemplate(data, backgroundColor);

    addCloseButtonEventListener();
    contentGallery.style.display = "block";
    currentPokemonId = data.id;
}

function showLoadingSpinner() {
    loadingSpinner.style.display = "block";
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = "none";
}

loadMoreButton.addEventListener("click", () => {
    currentOffset += limit;
    loadPokemons(currentOffset);
});

function handleCardClick(pokemonCard, pokemon) {
    pokemonCard.classList.remove("rotate");
    setTimeout(() => {
        pokemonCard.classList.add("rotate");
    }, 50);
    setTimeout(() => {
        const url = pokemon.url || generatePokemonUrl(pokemon);
        if (url) {
            showPokemonDetails(url);
        } else {
            console.error("Keine gültige URL für dieses Pokémon gefunden");
        }
    }, 600);
}

function generatePokemonUrl(pokemon) {
    return `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`;
}

function showPokemonDetails(url) {
    const pokemonId = extractPokemonId(url);
    fetchPokemonDetails(pokemonId);
}

function extractPokemonId(url) {
    return url.split("/")[6];
}

function fetchPokemonDetails(pokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => response.json())
    .then((data) => displayPokemonDetails(data))
    .catch((error) => console.error("Fehler beim Abrufen der Pokémon-Details:", error));
}

function showLastDetailCard() {
    if (currentPokemonId > 1) {
        currentPokemonId--; 
        showPokemonDetailsById(currentPokemonId);
    }
}

function showNextDetailCard() {
    currentPokemonId++;
    showPokemonDetailsById(currentPokemonId);
}

function createOverlayIfNeeded(contentGallery) {
    if (!contentGallery) {
        const overlay = createOverlay();
        document.body.appendChild(overlay);
        contentGallery = overlay;
    }
    return contentGallery;
}

function createOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "contentGallery";
    overlay.className = "content-gallery";
    return overlay;
}

function addCloseButtonEventListener() {
    const closeDetailBtn = document.querySelector("#closeDetailBtn");
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener("click", () => {
            const contentGallery = document.querySelector("#contentGallery");
            if (contentGallery) contentGallery.style.display = "none";
            currentPokemonId = null;
        });
    } else {
        console.error("Schließ-Button nicht gefunden!");
    }
}

function getBackgroundColorByType(types) {
    const primaryType = types[0].type.name;
    if (!pokemonTypesCache[primaryType]) {
        const typeColors = {
            fire: "rgba(255, 69, 0, 0.5)",
            water: "rgba(0, 0, 255, 0.5)",
            grass: "rgba(0, 255, 0, 0.5)",
            electric: "rgba(255, 255, 0, 0.5)",
            psychic: "rgba(255, 182, 193, 0.5)",
            bug: "rgba(34, 139, 34, 0.5)",
            normal: "rgba(169, 169, 169, 0.5)",
            poison: "rgba(128, 0, 128, 0.5)",
            ice: "rgba(0, 255, 255, 0.5)",
            dragon: "rgba(255, 0, 255, 0.5)",
            dark: "rgba(0, 0, 0, 0.5)",
            fairy: "rgba(255, 182, 193, 0.5)",
            fighting: "rgba(255, 69, 0, 0.5)",
            rock: "rgba(139, 69, 19, 0.5)",
            ground: "rgba(210, 105, 30, 0.5)",
            ghost: "rgba(128, 0, 128, 0.5)",
            steel: "rgba(192, 192, 192, 0.5)",
            flying: "rgba(135, 206, 235, 0.5)",
        };
        pokemonTypesCache[primaryType] = typeColors[primaryType] || "rgba(255, 255, 255, 1)";
    }
    return pokemonTypesCache[primaryType];
}

searchButton.addEventListener("click", () => {
    const searchTerm = getSearchTerm();
    if (isSearchTermValid(searchTerm)) {
        filterPokemons(searchTerm);
    } else {
        showErrorMessage("Bitte füge mindestens 3 Buchstaben zur Suche hinzu");
        resetPokemonGallery();
    }
    renderPokemonCardsGallery();
});

function getSearchTerm() {
    return searchInput.value.trim().toLowerCase();
}

function isSearchTermValid(searchTerm) {
    return searchTerm.length >= 3;
}

function filterPokemons(searchTerm) {
    errorMessage.style.display = "none";
    currentPokemons = allPokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm));
}

function showErrorMessage(message) {
    errorMessage.style.display = "block";
    errorMessage.textContent = message;
}

function resetPokemonGallery() {
    currentPokemons = allPokemons;
}

searchInput.addEventListener("focus", () => {
    if (!searchInput.value) {
        currentPokemons = allPokemons;
        renderPokemonCardsGallery();
    }
});
