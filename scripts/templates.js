/**
 * Creates the inner HTML markup for a single Pokémon gallery card.
 * NOTE: The outer .pokemon-card element is created in script.js.
 *
 * @param {{ id: number, name: string, sprites: { front_default: string }, types: Array }} pokemon
 * @returns {string}
 */
function createPokemonCardTemplate(pokemon) {
  return `
    <div class="pokemon-card-inner">
      <div class="tcg-top">
        <div class="tcg-name">
          ${pokemon.name}
        </div>
        <div class="tcg-id">
          # ${pokemon.id}
        </div>
      </div>

      <div class="tcg-art">
        <img
          class="card-img"
          src="${pokemon.sprites.front_default}"
          alt="${pokemon.name}"
        />
      </div>

      <div class="tcg-types">
        ${pokemon.types
          .map(
            (type) => `
              <button
                class="pokemon-type-button"
                type="button"
                style="background-color: ${getBackgroundColorByType([type])};"
              >
                ${type.type.name}
              </button>
            `
          )
          .join("")}
      </div>
    </div>

    <span class="tcg-orb" aria-hidden="true"></span>
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
 * @param {string} backgroundColor
 * @returns {string}
 */
function generatePokemonDetailsHTMLTemplate(data, backgroundColor) {
  return `
    <div
      class="pokemon-details-container"
      style="--type-color: ${backgroundColor};"
    >
      <div class="pokemon-details-inner">
        <div class="details-header-container">
          <div class="details-header">
            <p class="details-header-headline-nb">
              # ${data.id}
            </p>
            <div class="details-header-headline-txt">
              ${data.name}
            </div>
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
            <img
              class="details-img"
              src="${data.sprites.front_default}"
              alt="${data.name}"
            />
          </div>

          <div class="details-types-container">
            ${data.types
              .map(
                (type) => `
                  <button
                    class="pokemon-type-button"
                    type="button"
                    style="background-color: ${getBackgroundColorByType([type])};"
                  >
                    ${type.type.name}
                  </button>
                `
              )
              .join("")}
          </div>

          <div class="details-abilitiesnav">
            <button
              id="mainBtn"
              class="details-abilities-btns"
              type="button"
            >
              Main
            </button>
            <button
              id="statsBtn"
              class="details-abilities-btns"
              type="button"
            >
              Stats
            </button>
            <button
              id="evoChainBtn"
              class="details-abilities-btns"
              type="button"
            >
              Evo Chain
            </button>
          </div>

          <div class="details-stats-container">
            <ul class="details-stats-list">
              ${data.stats
                .map(
                  (stat) => `
                    <li class="details-stat-row">
                      <span class="details-stat-name">
                        ${stat.stat.name}
                      </span>
                      <span class="details-stat-value">
                        ${stat.base_stat}
                      </span>
                    </li>
                  `
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

      <span class="tcg-orb tcg-orb--details" aria-hidden="true"></span>
    </div>
  `;
}
