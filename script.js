function usePromise() {}

let allPokemons = [];
let currentPokemons = [];

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const pokemonGallery = document.querySelector("#pokemonGallery");
const notFoundMessage = document.querySelector("#notFoundMessage");
const errorMessage =
  document.querySelector(
    "#errorMessage"
  ); /* hier wird die fehlermeldung angezeigt */

fetch("https://pokeapi.co/api/v2/pokemon?limit=45&offset=24")
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results; /* speicher die abgerufenen pokemons */
    currentPokemons = allPokemons;
    renderPokemonCardsGallery(); /* zoag die pokemons in da gallery o */
  })
  .catch((error) =>
    console.error("error fetching pokémon:", error)
  ); /* wenns an fehler gibt beim hoin vo de pokemons dann fehler */

function renderPokemonCardsGallery() {
  pokemonGallery.innerHTML =
    ""; /* leere die gallery bevor neue pokemons angezeigt werden damids ned doppelt drin san */

  if (currentPokemons.length === 0) {
    notFoundMessage.style.display =
      "block"; /* zeigts de nicht gefunden nachricht an */
    return;
  } else {
    notFoundMessage.style.display =
      "none"; /* wenn keine pokemons gefunden wurden wird de nachricht versteckt */
  }

  currentPokemons.forEach((pokemon, index) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");

    pokemonCard.innerHTML = `
      <div class="card-header">
        <span class="card-header-txt">${pokemon.name}</span>
      </div>
      <div class="card-img-container">
        <img class="card-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 25
        }.png" alt="${pokemon.name}" />
      </div>
    `;

    pokemonCard.addEventListener("click", () => {
      /* wenn auf die karte geklickt wird zeigs die details vom pokemon o */
      showPokemonDetails(pokemon.url);
    });

    pokemonGallery.appendChild(
      pokemonCard
    ); /* fügt des pokemon der gallery hinzu */
  });
}

function showPokemonDetails(url) {
  const pokemonId = url.split("/")[6]; /* hol die id vom pokemon aus da url */
  fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  ) /* lade die details vom pokemon mit da id */
    .then((response) => response.json())
    .then((data) => {
      const contentGallery = document.querySelector("#contentGallery");

      // Erstelle ein neues div für das Overlay, falls es noch nicht existiert
      if (!contentGallery) {
        const overlay = document.createElement("div");
        overlay.id = "contentGallery";
        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)"; // Zentriert das Overlay sowohl horizontal als auch vertikal
        overlay.style.width = "80%";
        overlay.style.height = "auto";
        overlay.style.backgroundColor = "#fff";
        overlay.style.padding = "20px";
        overlay.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = "1000";
        overlay.style.overflowY = "auto";
        overlay.style.transition = "all 0.3s ease-in-out";

        document.body.appendChild(overlay);
      }

      // Bestimme den Hintergrund basierend auf den Typen des Pokémons
      const backgroundColor = getBackgroundColorByType(data.types);

      // Füge die Pokémon-Details zum Overlay hinzu
      contentGallery.innerHTML = `
  <div class="pokemon-details-container">
    <div class="details-header-container">
      <div class="details-header">
        <p class="details-header-headline-nb">#: ${data.id}</p>
        <h2 class="details-header-headline-txt">${data.name}</h2>
        <button id="closeDetailBtn" class="close-detail-btn" >
          X
        </button>        
      </div>
    </div>
      <div class="details-img-and-abilitiesnav-container">
        <div class="details-img-container">
          <img class="details-img" src="${data.sprites.front_default}" alt="${
        data.name
      }" style="width: 100px; height: 100px; margin-bottom: 20px;" />
        </div>
        <div class="details-abilitiesnav">
            <button id="mainBtn" class="details-abilities-btns">
            main
            </button>
            <button id="statsBtn" class="details-abilities-btns">
            stats
            </button>
            <button id="evoChainBtn" class="details-abilities-btns">
            evo chain
            </button>
        </div>
        <div class="details-stats-container">
          <p>Height: ${data.height} dm</p>
          <p>Weight: ${data.weight} hectograms</p>
          <p>Types: ${data.types.map((type) => type.type.name).join(", ")}</p>
          <h3>Stats:</h3>
          <ul>${data.stats
            .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
            .join("")}
          </ul>
        </div>
  </div>
      `;

      // Füge den Event Listener für den Schließen-Button hinzu
      const closeDetailBtn = document.querySelector("#closeDetailBtn");
      closeDetailBtn.addEventListener("click", () => {
        contentGallery.style.display = "none"; /* Versteckt das Overlay */
      });

      contentGallery.style.display = "block"; /* Zeigt das Overlay an */
    })
    .catch((error) =>
      console.error("error fetching pokémon details:", error)
    ); /* wenns da fehler gibt bei den details dann fehler */
}

// Hilfsfunktion zur Bestimmung der Hintergrundfarbe basierend auf den Pokémon-Typen
function getBackgroundColorByType(types) {
  // Definiere eine einfache Farbzuordnung für Pokémon-Typen
  const typeColors = {
    fire: "rgba(255, 69, 0, 0.5)",
    water: "rgba(0, 0, 255, 0.5)",
    grass: "rgba(0, 255, 0, 0.5)",
    electric: "rgba(255, 255, 0, 0.5)",
    psychic: "rgba(255, 182, 193, 0.5)",
    bug: "rgba(34, 139, 34, 0.5)",
    normal: "rgba(169, 169, 169, 0.5)",
    poison: "rgba(128, 0, 128, 0.5)",
    // Weitere Typen hinzufügen...
  };

  // Wenn Pokémon mehrere Typen hat, nimm den ersten Typ oder kombiniere sie
  const primaryType = types[0].type.name;
  return typeColors[primaryType] || "rgba(255, 255, 255, 0.5)"; // Standardfarbe falls kein Typ zugeordnet werden kann
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value
    .trim()
    .toLowerCase(); /* was wird im suchfeld eingegeben */

  if (searchTerm.length < 3) {
    /* wenn nach weniga als 3 buchstaben gesucht werd */
    errorMessage.style.display = "block"; /* zeig de fehlermeldung an */
    errorMessage.textContent =
      /* und zeig de meldung : o*/
      "bitte füge mindestens 3 buchstaben zur suche hinzu";
    currentPokemons = allPokemons;
    renderPokemonCardsGallery(); /* zeig alle pokemons wieda o */
    return;
  }

  errorMessage.style.display = "none"; /* versteck die fehlermeldung*/
  currentPokemons = allPokemons.filter(
    (pokemon) =>
      pokemon.name
        .toLowerCase()
        .includes(searchTerm) /* such nachm befehl im pokemon name */
  );
  renderPokemonCardsGallery(); /* zeig die gfilterten pokemons o */
});

searchInput.addEventListener("focus", () => {
  if (!searchInput.value) {
    currentPokemons =
      allPokemons; /* wenn das suchfeld leer is zeig wieder alle pokemons an */
    renderPokemonCardsGallery();
  }
});
