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
    ""; /* leere die gallery bevor neue pokemons angezeigt werden damids ned doppelt drin san*/

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
      contentGallery.innerHTML = `
        <h2>${data.name}</h2>
        <button id="closeDetailBtn" class="close-detail-btn">X</button>
        <p>Height: ${data.height} dm</p>
        <p>Weight: ${data.weight} hectograms</p>
        <p>Types: ${data.types.map((type) => type.type.name).join(", ")}</p>
        <h3>Stats:</h3>
        <ul>
          ${data.stats
            .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
            .join("")}
        </ul>
      `;
    })
    .catch((error) =>
      console.error("error fetching pokémon details:", error)
    ); /* wenns da fehler gibt bei den details dann fehler */
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value
    .trim()
    .toLowerCase(); /* was wird im suchfeld eingegeben */

  if (searchTerm.length < 3) { /* wenn nach weniga als 3 buchstaben gesucht werd */
    errorMessage.style.display = "block"; /* zeig de fehlermeldung an */
    errorMessage.textContent = /* und zeig de meldung : o*/
      "bitte füge mindestens 3 buchstaben zur suche hinzu";
    currentPokemons = allPokemons;
    renderPokemonCardsGallery(); /* zeig alle pokemons wieda o */ 
    return;
  }

  errorMessage.style.display =
    "none"; /* versteck die fehlermeldung*/
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

closeDetailBtn.addEventListener("click", () => {
  const contentGallery = document.querySelector("#contentGallery");
  contentGallery.innerHTML = ""; /* löscht die detailansicht */
  closeDetailBtn.style.display = "none"; /* versteckt den schließen button */
  renderPokemonCardsGallery(); /* zeig wieder die galerie an */
});
