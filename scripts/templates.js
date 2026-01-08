/**
 * Creates the HTML markup for a single Pokémon gallery card.
 *
 * @param {{ id: number, name: string, sprites: { front_default: string }, types: Array }} pokemon
 *   Pokémon object as returned by the PokéAPI.
 * @param {string} cardBackgroundColor
 *   Background colour derived from the primary Pokémon type.
 * @returns {string}
 *   HTML string representing the gallery card.
 */
function createPokemonCardTemplate(pokemon, cardBackgroundColor) {
  return `
        <div class="pokemon-card" style="background-color: ${cardBackgroundColor};">
            <div class="card-header">
                <span class="card-header-nb"># ${pokemon.id}</span>
                <span class="card-header-txt">${pokemon.name}</span>
            </div>
            <div class="card-img-container">
                <img class="card-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            </div>
            <div class="details-types-container">
                ${pokemon.types
                  .map(
                    (type) => `
                    <button class="pokemon-type-button" style="background-color: ${getBackgroundColorByType([
                      type
                    ])};">
                        ${type.type.name}
                    </button>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}

/**
 * Creates the HTML markup for the Pokémon details dialog.
 *
 * @param {{
 *   id: number,
 *   name: string,
 *   sprites: { front_default: string },
 *   types: Array,
 *   stats: Array<{ stat: { name: string }, base_stat: number }>
 * }} data
 *   Detailed Pokémon data as returned by the PokéAPI.
 * @param {string} backgroundColor
 *   Background colour derived from the Pokémon type.
 * @returns {string}
 *   HTML string representing the details dialog content.
 */
function generatePokemonDetailsHTMLTemplate(data, backgroundColor) {
  return `
        <div class="pokemon-details-container" style="background-color: ${backgroundColor};">
            <div class="details-header-container">
                <div class="details-header">
                    <p class="details-header-headline-nb"># ${data.id}</p>
                    <div class="details-header-headline-txt">${data.name}</div>
                    <button
                        id="closeDetailBtn"
                        class="close-detail-btn"
                        type="button"
                        aria-label="Details schließen"
                    >
                        X
                    </button>
                </div>
            </div>
            <div class="details-img-and-abilitiesnav-container">
                <div class="details-img-container">
                    <img class="details-img" src="${data.sprites.front_default}" alt="${data.name}"/>
                </div>
                <div class="details-types-container">
                    ${data.types
                      .map(
                        (type) => `
                        <button class="pokemon-type-button" style="background-color: ${getBackgroundColorByType([
                          type
                        ])};">
                            ${type.type.name}
                        </button>
                    `
                      )
                      .join("")}
                </div>
                <div class="details-abilitiesnav">
                    <button id="mainBtn" class="details-abilities-btns">Main</button>
                    <button id="statsBtn" class="details-abilities-btns">Stats</button>
                    <button id="evoChainBtn" class="details-abilities-btns">Evo Chain</button>
                </div>
                <div class="details-stats-container">
                    <ul class="details-stats-list">
                        ${data.stats
                          .map(
                            (stat) =>
                              `<li>${stat.stat.name}: ${stat.base_stat}</li>`
                          )
                          .join("")}
                    </ul>
                    <div class="back-and-forth-container">
                        <button
                            class="back-btn"
                            type="button"
                            onclick="showLastDetailCard()"
                            aria-label="Vorheriges Pokémon anzeigen"
                        >
                            ←
                        </button>
                        
                        <button
                            class="forth-btn"
                            type="button"
                            onclick="showNextDetailCard()"
                            aria-label="Nächstes Pokémon anzeigen"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
