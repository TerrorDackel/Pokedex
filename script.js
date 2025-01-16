function usePromise() {} /* hier wird eine leere funktion deklariert die anscheinend nirgends verwendet wird */

let allPokemons =
  []; /* hier wird ein leeres array für alle pokemons erstellt */
let currentPokemons =
  []; /* hier wird ein leeres array für die aktuell angezeigten pokemons erstellt */
let pokemonTypesCache =
  {}; /* hier wird ein leeres objekt für den cache von pokemontypen erstellt */

const searchInput =
  document.querySelector(
    "#searchInput"
  ); /* sucht das input-feld für die suchanfrage */
const searchButton =
  document.querySelector(
    "#searchButton"
  ); /* sucht den button zum starten der suche */
const pokemonGallery =
  document.querySelector(
    "#pokemonGallery"
  ); /* sucht den container für die pokemon-galerie */
const notFoundMessage =
  document.querySelector(
    "#notFoundMessage"
  ); /* sucht die nachricht für nicht gefundene pokemons */
const errorMessage =
  document.querySelector(
    "#errorMessage"
  ); /* sucht die nachricht für fehler bei der suche */

fetch(
  "https://pokeapi.co/api/v2/pokemon?limit=20&offset=24"
) /* lädt die ersten 165 pokemons mit einem offset von 24 */
  .then((response) =>
    response.json()
  ) /* wandelt die antwort in ein json-objekt um */
  .then((data) => {
    /* hier wird weitergearbeitet wenn die daten erfolgreich geladen sind */
    const pokemonPromises = data.results.map(
      (pokemon /* für jedes pokemon wird ein promise erstellt */) =>
        fetch(pokemon.url) /* ruft die details für jedes pokemon ab */
          .then((response) =>
            response.json()
          ) /* wandelt die antwort in json um */
          .then(
            (pokemonDetails) => pokemonDetails
          ) /* gibt die pokemon-details zurück */
    );
    Promise.all(pokemonPromises).then((pokemons) => {
      /* wartet auf alle promises und wenn sie alle fertig sind */
      allPokemons =
        pokemons; /* speichert die geladenen pokemons in allPokemons */
      currentPokemons =
        allPokemons; /* setzt die aktuellen pokemons auf die geladenen pokemons */
      renderPokemonCardsGallery(); /* rendert die pokemon-galerie */
    });
  })
  .catch((error) =>
    console.error("Fehler beim Abrufen der Pokémon:", error)
  ); /* wenn ein fehler beim laden passiert, wird er hier ausgegeben */

function renderPokemonCardsGallery() {
  /* rendert die pokemon-karten in der galerie */
  clearGallery(); /* leert die galerie vor dem neu-rendern */
  if (currentPokemons.length === 0) {
    /* wenn keine pokemons zum anzeigen vorhanden sind */
    showNotFoundMessage(); /* zeigt die "nicht gefunden"-nachricht */
    return;
  } else {
    hideNotFoundMessage(); /* wenn pokemons vorhanden sind, wird die nachricht versteckt */
  }
  currentPokemons.forEach((pokemon) => {
    /* für jedes pokemon wird eine karte erstellt */
    const pokemonCard =
      createPokemonCard(pokemon); /* erstellt die pokemon-karte */
    pokemonCard.addEventListener("click", () =>
      handleCardClick(pokemonCard, pokemon)
    ); /* fügt ein event hinzu, das bei einem klick die details des pokemons anzeigt */
    pokemonGallery.appendChild(
      pokemonCard
    ); /* fügt die pokemon-karte zur galerie hinzu */
  });
}

function clearGallery() {
  /* leert die galerie */
  pokemonGallery.innerHTML =
    ""; /* setzt den inneren html der galerie auf leer */
}

function showNotFoundMessage() {
  /* zeigt die "nicht gefunden"-nachricht an */
  notFoundMessage.style.display =
    "block"; /* setzt die anzeige der nachricht auf block */
}

function hideNotFoundMessage() {
  /* versteckt die "nicht gefunden"-nachricht */
  notFoundMessage.style.display =
    "none"; /* setzt die anzeige der nachricht auf none */
}

function createPokemonCard(pokemon) {
  /* erstellt eine pokemon-karte */
  const pokemonCard =
    document.createElement("div"); /* erstellt ein div für die karte */
  pokemonCard.classList.add(
    "pokemon-card"
  ); /* fügt der karte die klasse "pokemon-card" hinzu */

  const cardBackgroundColor = getBackgroundColorByType(
    pokemon.types
  ); /* holt sich die hintergrundfarbe basierend auf den typen des pokemons */

  pokemonCard.innerHTML =
    /* hier wird der inhalt der pokemon-karte erstellt */
    ` 
  <div class="pokemon-card" style="background-color: ${cardBackgroundColor};">
    <div class="card-header" >
      <span class="card-header-txt">${pokemon.name}</span>
    </div>
    <div class="card-img-container">
      <img class="card-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
    </div>
  </div>
  `;

  return pokemonCard; /* gibt die erstellte pokemon-karte zurück */
}

function handleCardClick(pokemonCard, pokemon) {
  /* wird aufgerufen wenn auf eine pokemon-karte geklickt wird */
  pokemonCard.classList.remove(
    "rotate"
  ); /* entfernt die "rotate"-klasse von der karte */
  setTimeout(() => {
    /* nach einer kurzen zeit wird die "rotate"-klasse wieder hinzugefügt um eine dreh-animaiton zu starten */
    pokemonCard.classList.add("rotate");
  }, 50);
  setTimeout(() => {
    /* nach einer weiteren kurzen zeit wird die detail-seite für das pokemon geöffnet */
    const url =
      pokemon.url ||
      generatePokemonUrl(pokemon); /* holt sich die url des pokemons */
    if (url) {
      showPokemonDetails(url); /* zeigt die details des pokemons an */
    } else {
      console.error(
        "Keine gültige URL für dieses Pokémon gefunden"
      ); /* gibt einen fehler aus, falls keine gültige url gefunden wurde */
    }
  }, 600);
}

function generatePokemonUrl(pokemon) {
  /* erstellt die url für ein pokemon basierend auf seiner id */
  return `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`; /* gibt die generierte url zurück */
}

function showPokemonDetails(url) {
  /* zeigt die details eines pokemons an */
  const pokemonId =
    extractPokemonId(url); /* extrahiert die pokemon-id aus der url */
  fetchPokemonDetails(
    pokemonId
  ); /* lädt die details des pokemons basierend auf der id */
}

function extractPokemonId(url) {
  /* extrahiert die pokemon-id aus einer url */
  return url.split("/")[6]; /* teilt die url und gibt den teil der id zurück */
}

function fetchPokemonDetails(pokemonId) {
  /* lädt die details für ein pokemon basierend auf seiner id */
  fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  ) /* ruft die api mit der pokemon-id auf */
    .then((response) => response.json()) /* wandelt die antwort in json um */
    .then((data) =>
      displayPokemonDetails(data)
    ) /* zeigt die details des pokemons an */
    .catch(
      (error) =>
        console.error(
          "Fehler beim Abrufen der Pokémon-Details:",
          error
        ) /* gibt einen fehler aus wenn etwas schiefgeht */
    );
}

function displayPokemonDetails(data) {
  /* zeigt die pokemon-details an */
  let contentGallery =
    document.querySelector(
      "#contentGallery"
    ); /* sucht den container für die detailansicht */
  contentGallery =
    createOverlayIfNeeded(
      contentGallery
    ); /* erstellt ein overlay wenn noch keins existiert */

  const backgroundColor = getBackgroundColorByType(
    data.types
  ); /* holt sich die hintergrundfarbe basierend auf den typen des pokemons */
  contentGallery.innerHTML = generatePokemonDetailsHTML(
    data,
    backgroundColor
  ); /* setzt den inhalt der detailansicht */

  addCloseButtonEventListener(); /* fügt ein eventlistener für den schließ-button hinzu */
  contentGallery.style.display = "block"; /* zeigt die detailansicht an */
}

function createOverlayIfNeeded(contentGallery) {
  /* erstellt ein overlay wenn noch keines vorhanden ist */
  if (!contentGallery) {
    /* wenn kein overlay existiert */
    const overlay = createOverlay(); /* erstellt ein neues overlay */
    document.body.appendChild(overlay); /* fügt das overlay zum body hinzu */
    contentGallery = overlay; /* setzt das overlay als contentGallery */
  }
  return contentGallery; /* gibt das overlay zurück */
}

function createOverlay() {
  /* erstellt ein neues overlay-div */
  const overlay = document.createElement("div");
  overlay.id = "contentGallery"; /* setzt die id des overlays */
  return overlay; /* gibt das overlay zurück */
}

function generatePokemonDetailsHTML(data, backgroundColor) {
  /* erstellt den html-code für die detailansicht eines pokemons */
  return `
    <div class="content-gallery" id="contentGallery">
      <div class="pokemon-details-container" style="background-color: ${backgroundColor};">
        <div class="details-header-container">
          <div class="details-header">
            <p class="details-header-headline-nb">#: ${data.id}</p>
            <h2 class="details-header-headline-txt">${data.name}</h2>
            <button id="closeDetailBtn" class="close-detail-btn">X</button>
          </div>
        </div>
        <div class="details-img-and-abilitiesnav-container">
          <div class="details-img-container">
            <img class="details-img" src="${data.sprites.front_default}" alt="${
    data.name
  }" style="width: 100px; height: 100px; margin-bottom: 20px;" />
          </div>
          <div class="details-abilitiesnav">
            <button id="mainBtn" class="details-abilities-btns">Main</button>
            <button id="statsBtn" class="details-abilities-btns">Stats</button>
            <button id="evoChainBtn" class="details-abilities-btns">Evo Chain</button>
          </div>
          <div class="details-stats-container">
            <h3>Stats:</h3>
            <ul>
              ${data.stats
                .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function addCloseButtonEventListener() {
  /* fügt einen eventlistener für den schließ-button hinzu */
  const closeDetailBtn =
    document.querySelector("#closeDetailBtn"); /* sucht den schließ-button */
  closeDetailBtn.addEventListener("click", () => {
    /* wenn der button geklickt wird */
    const contentGallery =
      document.querySelector("#contentGallery"); /* sucht die contentGallery */
    contentGallery.style.display = "none"; /* versteckt die detailansicht */
  });
}

function getBackgroundColorByType(types) {
  /* holt sich die hintergrundfarbe basierend auf den typen des pokemons */
  const primaryType =
    types[0].type.name; /* holt sich den ersten typ des pokemons */

  if (!pokemonTypesCache[primaryType]) {
    /* wenn der typ noch nicht im cache ist */
    const typeColors = {
      /* hier werden die typ-farben festgelegt */ fire: "rgba(255, 69, 0, 0.5)",
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
    pokemonTypesCache[primaryType] =
      /* speichert die farbe des typs im cache */
      typeColors[primaryType] ||
      "rgba(255, 255, 255, 0.5)"; /* falls der typ nicht existiert, wird eine standardfarbe verwendet */
  }

  return pokemonTypesCache[primaryType]; /* gibt die hintergrundfarbe zurück */
}

searchButton.addEventListener("click", () => {
  /* wenn der such-button geklickt wird */
  const searchTerm = getSearchTerm(); /* holt sich den suchbegriff */
  if (isSearchTermValid(searchTerm)) {
    /* wenn der suchbegriff gültig ist (mindestens 3 buchstaben) */
    filterPokemons(
      searchTerm
    ); /* filtert die pokemons basierend auf dem suchbegriff */
  } else {
    showErrorMessage(
      "Bitte füge mindestens 3 Buchstaben zur Suche hinzu"
    ); /* zeigt eine fehlernachricht an */
    resetPokemonGallery(); /* setzt die galerie zurück */
  }
  renderPokemonCardsGallery(); /* rendert die pokemon-galerie */
});

function getSearchTerm() {
  /* holt sich den suchbegriff */
  return searchInput.value
    .trim()
    .toLowerCase(); /* entfernt führende und nachfolgende leerzeichen und setzt den text in kleinschreibung */
}

function isSearchTermValid(searchTerm) {
  /* prüft ob der suchbegriff mindestens 3 buchstaben hat */
  return searchTerm.length >= 3;
}

function filterPokemons(searchTerm) {
  /* filtert die pokemons basierend auf dem suchbegriff */
  errorMessage.style.display = "none"; /* versteckt die fehlernachricht */
  currentPokemons = allPokemons.filter(
    /* filtert alle pokemons und behält nur die, die den suchbegriff enthalten */
    (pokemon) => pokemon.name.toLowerCase().includes(searchTerm)
  );
}

function showErrorMessage(message) {
  /* zeigt eine fehlernachricht an */
  errorMessage.style.display =
    "block"; /* setzt die anzeige der nachricht auf block */
  errorMessage.textContent = message; /* setzt den inhalt der nachricht */
}

function resetPokemonGallery() {
  /* setzt die pokemon-galerie zurück */
  currentPokemons =
    allPokemons; /* setzt die aktuellen pokemons auf alle pokemons zurück */
}

searchInput.addEventListener("focus", () => {
  /* wenn das input-feld den fokus bekommt */
  if (!searchInput.value) {
    /* wenn das input-feld leer ist */
    currentPokemons =
      allPokemons; /* setzt die aktuellen pokemons auf alle pokemons zurück */
    renderPokemonCardsGallery(); /* rendert die pokemon-galerie */
  }
});
