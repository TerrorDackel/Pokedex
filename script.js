let allPokemons = [];
let currentPokemons = [];
let pokemonTypesCache = {};
let currentOffset = 40;
let currentPokemonId = null;
let lastFocusedCard = null;

const limit = 110;
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
    const pokemonPromises = data.results.map((pokemon) =>
      fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokemonDetails) => pokemonDetails)
    );
    Promise.all(pokemonPromises).then((pokemons) => {
      allPokemons = pokemons;
      currentPokemons = allPokemons;
      renderPokemonCardsGallery();
    });
  })
  .catch((error) => console.error("Fehler beim Abrufen der Pokémon:", error));

/**
 * Loads an additional batch of Pokémon from the API and appends them to the list.
 *
 * @param {number} offset
 *   Offset within the PokéAPI Pokémon collection.
 * @returns {void}
 */
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

/**
 * Renders all currently filtered Pokémon into the gallery container.
 *
 * @returns {void}
 */
function renderPokemonCardsGallery() {
  clearGallery();

  if (currentPokemons.length === 0) {
    showNotFoundMessage();
    return;
  }

  hideNotFoundMessage();

  currentPokemons.forEach((pokemon) => {
    const pokemonCard = createPokemonCard(pokemon);
    pokemonCard.addEventListener("click", () =>
      handleCardClick(pokemonCard, pokemon)
    );
    pokemonGallery.appendChild(pokemonCard);
  });
}

/**
 * Clears the gallery element content.
 *
 * @returns {void}
 */
function clearGallery() {
  pokemonGallery.innerHTML = "";
}

/**
 * Shows the “not found” message for unsuccessful searches.
 *
 * @returns {void}
 */
function showNotFoundMessage() {
  notFoundMessage.style.display = "block";
}

/**
 * Hides the “not found” message.
 *
 * @returns {void}
 */
function hideNotFoundMessage() {
  notFoundMessage.style.display = "none";
}

/**
 * Creates an accessible Pokémon card element with keyboard and screen-reader support.
 *
 * @param {{
 *   id: number,
 *   name: string,
 *   types: Array,
 *   sprites: { front_default: string }
 * }} pokemon
 *   Pokémon data object as returned by the PokéAPI.
 * @returns {HTMLDivElement}
 *   A configured card element that can be activated via mouse or keyboard.
 */
function createPokemonCard(pokemon) {
  const cardBackgroundColor = getBackgroundColorByType(pokemon.types);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = createPokemonCardTemplate(pokemon, cardBackgroundColor);

  /** @type {HTMLDivElement|null} */
  const pokemonCard = wrapper.firstElementChild;

  if (!pokemonCard) {
    console.error("Card template did not render a root element");
    return document.createElement("div");
  }

  pokemonCard.setAttribute("role", "button");
  pokemonCard.setAttribute("tabindex", "0");
  pokemonCard.setAttribute("aria-label", `Details zu ${pokemon.name}`);

  /* Old implementation created a .pokemon-card element and then nested another .pokemon-card inside innerHTML. */
  /* This caused double borders and double ::before/::after animations (orbit + glow). */

  pokemonCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(pokemonCard, pokemon);
    }
  });

  return pokemonCard;
}

/**
 * Loads and displays the details for a Pokémon identified by its numeric id.
 *
 * @param {number} pokemonId
 *   Numeric Pokémon id as used by the PokéAPI.
 * @returns {void}
 */
function showPokemonDetailsById(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => response.json())
    .then((data) => displayPokemonDetails(data))
    .catch((error) => {
      console.error("Fehler beim Abrufen der Pokémon-Details:", error);
    });
}

/**
 * Renders the detail overlay for a given Pokémon data object.
 * Sets dialog semantics and focuses the close button for accessibility.
 *
 * @param {{
 *   id: number,
 *   name: string,
 *   sprites: { front_default: string },
 *   types: Array,
 *   stats: Array
 * }} data
 *   Detailed Pokémon data as returned by the PokéAPI.
 * @returns {void}
 */
function displayPokemonDetails(data) {
  let contentGallery = document.querySelector("#contentGallery");
  contentGallery = createOverlayIfNeeded(contentGallery);

  const backgroundColor = getBackgroundColorByType(data.types);
  contentGallery.innerHTML = generatePokemonDetailsHTMLTemplate(
    data,
    backgroundColor
  );

  contentGallery.setAttribute("role", "dialog");
  contentGallery.setAttribute("aria-modal", "true");
  contentGallery.setAttribute("aria-label", `Details zu ${data.name}`);

  addCloseButtonEventListener();
  contentGallery.style.display = "block";
  currentPokemonId = data.id;

  const closeDetailBtn = document.querySelector("#closeDetailBtn");
  if (closeDetailBtn) {
    closeDetailBtn.focus();
  }
}

/**
 * Shows the loading spinner and hides the “Load more” text.
 * Also activates the rotation animation on the button.
 *
 * @returns {void}
 */
function showLoadingSpinner() {
  loadingSpinner.style.display = "block";

  const loadMoreText = document.querySelector(".load-more-btn-txt");
  if (loadMoreText) {
    loadMoreText.style.display = "none";
  }

  if (loadMoreButton) {
    loadMoreButton.classList.add("load-more-btn--loading");
  }
}

/**
 * Hides the loading spinner, restores the “Load more” text
 * and stops the rotation animation on the button.
 *
 * @returns {void}
 */
function hideLoadingSpinner() {
  loadingSpinner.style.display = "none";

  const loadMoreText = document.querySelector(".load-more-btn-txt");
  if (loadMoreText) {
    loadMoreText.style.display = "block";
  }

  if (loadMoreButton) {
    loadMoreButton.classList.remove("load-more-btn--loading");
  }
}

/**
 * Handles clicking the “Load more” button by requesting the next batch
 * and updating the offset pointer afterwards.
 *
 * @returns {void}
 */
loadMoreButton.addEventListener("click", () => {
  loadPokemons(currentOffset);
  currentOffset += limit;
});

/**
 * Handles selection of a Pokémon card:
 * plays the rotation animation and then opens the details dialog.
 *
 * @param {HTMLDivElement} pokemonCard
 *   The card element that has been activated.
 * @param {{ id: number, name: string, url?: string, types: Array }} pokemon
 *   Displayed Pokémon data.
 * @returns {void}
 */
function handleCardClick(pokemonCard, pokemon) {
  lastFocusedCard = pokemonCard;
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

/**
 * Builds the details URL for a given Pokémon by id.
 *
 * @param {{ id: number }} pokemon
 *   Pokémon data object containing at least the id.
 * @returns {string}
 *   Fully qualified PokéAPI URL for that Pokémon.
 */
function generatePokemonUrl(pokemon) {
  return `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`;
}

/**
 * Resolves the Pokémon id from its API URL and loads the corresponding details.
 *
 * @param {string} url
 *   PokéAPI URL for a specific Pokémon.
 * @returns {void}
 */
function showPokemonDetails(url) {
  const pokemonId = extractPokemonId(url);
  fetchPokemonDetails(pokemonId);
}

/**
 * Extracts the Pokémon id segment from a PokéAPI URL.
 *
 * @param {string} url
 *   PokéAPI URL for a Pokémon.
 * @returns {string}
 *   Id part of the URL as a string.
 */
function extractPokemonId(url) {
  return url.split("/")[6];
}

/**
 * Fetches detailed data for a Pokémon and delegates to the detail renderer.
 *
 * @param {number|string} pokemonId
 *   Pokémon id to fetch from the API.
 * @returns {void}
 */
function fetchPokemonDetails(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => response.json())
    .then((data) => displayPokemonDetails(data))
    .catch((error) =>
      console.error("Fehler beim Abrufen der Pokémon-Details:", error)
    );
}

/**
 * Shows the previous Pokémon in the details dialog, if available.
 *
 * @returns {void}
 */
function showLastDetailCard() {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    showPokemonDetailsById(currentPokemonId);
  }
}

/**
 * Shows the next Pokémon in the details dialog.
 *
 * @returns {void}
 */
function showNextDetailCard() {
  currentPokemonId++;
  showPokemonDetailsById(currentPokemonId);
}

/**
 * Ensures that the overlay element exists and returns it.
 * Creates and appends it to the document body if necessary.
 *
 * @param {HTMLElement|null} contentGallery
 *   Existing overlay element or null.
 * @returns {HTMLElement}
 *   Valid overlay element ready to be populated.
 */
function createOverlayIfNeeded(contentGallery) {
  if (!contentGallery) {
    const overlay = createOverlay();
    document.body.appendChild(overlay);
    contentGallery = overlay;
  }
  return contentGallery;
}

/**
 * Creates the base overlay container used for the details dialog.
 *
 * @returns {HTMLDivElement}
 *   Newly created overlay element.
 */
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "contentGallery";
  overlay.className = "content-gallery";
  return overlay;
}

/**
 * Wires the close button inside the details dialog to hide the overlay
 * and restore keyboard focus to the previously selected card.
 *
 * @returns {void}
 */
function addCloseButtonEventListener() {
  const closeDetailBtn = document.querySelector("#closeDetailBtn");
  if (closeDetailBtn) {
    closeDetailBtn.addEventListener("click", () => {
      const contentGallery = document.querySelector("#contentGallery");
      if (contentGallery) {
        contentGallery.style.display = "none";
      }
      currentPokemonId = null;
      if (lastFocusedCard) {
        lastFocusedCard.focus();
      }
    });
  } else {
    console.error("Schließ-Button nicht gefunden!");
  }
}

/**
 * Resolves and caches a semi-transparent background colour for a Pokémon type.
 *
 * @param {Array<{ type: { name: string } }>} types
 *   Types array from the PokéAPI Pokémon object.
 * @returns {string}
 *   RGBA colour string representing the primary type.
 */
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
      flying: "rgba(135, 206, 235, 0.5)"
    };

    pokemonTypesCache[primaryType] =
      typeColors[primaryType] || "rgba(255, 255, 255, 1)";
  }

  return pokemonTypesCache[primaryType];
}

/**
 * Normalises the current search term from the input field.
 *
 * @returns {string}
 *   Lowercased, trimmed search term.
 */
function getSearchTerm() {
  return searchInput.value.trim().toLowerCase();
}

/**
 * Validates the search term length.
 *
 * @param {string} searchTerm
 *   Term to validate.
 * @returns {boolean}
 *   True if the term is long enough to search, otherwise false.
 */
function isSearchTermValid(searchTerm) {
  return searchTerm.length >= 3;
}

/**
 * Filters the Pokémon list by name based on the given term.
 *
 * @param {string} searchTerm
 *   Term used to filter Pokémon names.
 * @returns {void}
 */
function filterPokemons(searchTerm) {
  errorMessage.style.display = "none";
  currentPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );
}

/**
 * Shows a validation error message below the search area.
 *
 * @param {string} message
 *   Human-readable explanation of the problem.
 * @returns {void}
 */
function showErrorMessage(message) {
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
}

/**
 * Resets the gallery filter so that all loaded Pokémon are shown again.
 *
 * @returns {void}
 */
function resetPokemonGallery() {
  currentPokemons = allPokemons;
}

/**
 * Handles the search button click by validating the term,
 * applying the filter and re-rendering the gallery.
 *
 * @returns {void}
 */
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

/**
 * Handles the “Enter” key inside the search input.
 * Mirrors the behaviour of the search button.
 *
 * @returns {void}
 */
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const searchTerm = getSearchTerm();

    if (isSearchTermValid(searchTerm)) {
      filterPokemons(searchTerm);
    } else {
      showErrorMessage("Bitte füge mindestens 3 Buchstaben zur Suche hinzu");
      resetPokemonGallery();
    }

    renderPokemonCardsGallery();
  }
});

/**
 * Restores the full gallery when the search input gains focus
 * and is currently empty.
 *
 * @returns {void}
 */
searchInput.addEventListener("focus", () => {
  if (!searchInput.value) {
    currentPokemons = allPokemons;
    renderPokemonCardsGallery();
  }
});
