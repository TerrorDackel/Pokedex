function createPokemonCardsGallery(cardsGallery) {
  let pokemonCardsGalleryHTML = `<div class="pokemon-gallery-container">
        <div id="pokemonGallery" class="pokemon-gallery">
          <div class="card-header">
            <span class="card-header-txt"></span>
          </div>
          <div class="card-img-container">
            <img class="card-img" src="" alt="" />
          </div>
          <div class="card-abilities">
            <img class="card-abilities-logos" src="" alt="" />
            <img class="card-abilities-logos" src="" alt="" />
            <img class="card-abilities-logos" src="" alt="" />
          </div>

          <!-- dieser div wird erst bei bei onclick auf eines der pokemoncarten angezeigt und die karte wird dabei vergrößert dargestellt und die stats werden mit angezeigt -->
          <div class="card-container-navbar-and-content">
            <div class="card-container-navbar">
              <nav class="card-navbar">
                <button class="card-navbar-btn">stats</button>
              </nav>
            </div>
            <div id="contentGallery" class="card-content-navbar">
          <!-- die stats werden mit angezeigt  -->
            </div>
          </div>
        </div>
      </div>`;
  return pokemonCardsGalleryHTML;
}
