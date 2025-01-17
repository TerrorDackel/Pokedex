// template für die pokemon-karten
const pokemonCardTemplate = (pokemon, backgroundColor) => `
  <div class="pokemon-card" style="background-color: ${backgroundColor};">
    <div class="card-header">
      <span class="card-header-txt">${pokemon.name || "Unbekannt"}</span>
    </div>
    <div class="card-img-container">
      <img class="card-img" src="${
        pokemon.sprites.front_default || "path/to/default/image.png"
      }" alt="${pokemon.name || "Pokemon"}" />
    </div>
  </div>
`;

// template für die pokemondetailansicht
const pokemonDetailsTemplate = (data, backgroundColor) => `
  <div class="content-gallery" id="contentGallery">
    <div class="pokemon-details-container" style="background-color: ${backgroundColor};">
      <div class="details-header-container">
        <div class="details-header">
          <p class="details-header-headline-nb">#: ${data.id || "Unbekannt"}</p>
          <h2 class="details-header-headline-txt">${
            data.name || "Unbekannt"
          }</h2>
          <button id="closeDetailBtn" class="close-detail-btn">X</button>
        </div>
      </div>
      <div class="details-img-and-abilitiesnav-container">
        <div class="details-img-container">
          <img class="details-img" src="${
            data.sprites.front_default || "path/to/default/image.png"
          }" alt="${
  data.name || "Pokemon"
}" style="width: 100px; height: 100px; margin-bottom: 20px;" />
        </div>
        <!-- Weitere Elemente -->
      </div>
    </div>
  </div>
`;
