function createPokemonCardTemplate(pokemon, cardBackgroundColor) {
  return `
    <div class="pokemon-card" style="background-color: ${cardBackgroundColor};">
      <div class="card-header">
        <span class="card-header-nb"># ${pokemon.id}</span>
        <span class="card-header-txt">${pokemon.name}</span>
      </div>
      <div class="card-img-container">
        <img class="card-img" src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }" />
      </div>
      <div class="details-types-container">
        ${pokemon.types
          .map(
            (type) => `
              <button class="pokemon-type-button" style="background-color: ${getBackgroundColorByType(
                [type]
              )};">
                ${type.type.name}
              </button>`
          )
          .join("")}
      </div>
    </div>
  `;
}


function generatePokemonDetailsHTMLTemplate(data, backgroundColor) {
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
  }" />
          </div>
          <div class="details-types-container">
            ${data.types
              .map(
                (type) => `
                  <button class="pokemon-type-button" style="background-color: ${getBackgroundColorByType(
                    [type]
                  )};">
                    ${type.type.name}
                  </button>`
              )
              .join("")}
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
