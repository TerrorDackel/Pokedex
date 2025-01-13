function usePromise(){

}

let allPokemons = [];

/*hier de url eidrong vo wo mir fetchen wollen*/
fetch(`https://pokeapi.co/api/v2/pokemon?limit=45&offset=24`)
      .then(response => response.json())                    /* mir warten auf den response und wandeln den in a jason um*/
      .then((data) => {                                                 /* danach de results in den array all Pokemon übergeben*/
            allPokemons = data.results;
} ); 

