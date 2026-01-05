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
                    ${data.types.map((type) => `
                        <button class="pokemon-type-button" style="background-color: ${getBackgroundColorByType([type])};">
                            ${type.type.name}
                        </button>
                    `).join("")}
                </div>
                <div class="details-abilitiesnav">
                    <button id="mainBtn" class="details-abilities-btns">Main</button>
                    <button id="statsBtn" class="details-abilities-btns">Stats</button>
                    <button id="evoChainBtn" class="details-abilities-btns">Evo Chain</button>
                </div>
                <div class="details-stats-container">
                    <ul class="details-stats-list">
                        ${data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join("")}
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
