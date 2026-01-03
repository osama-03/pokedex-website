const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const favoritesFilter = document.querySelector("#favorites");
const notFoundMessage = document.querySelector("#not-found-message");
const closeButton = document.querySelector(".search-close-icon")
let allPokemons = [];


// Fetch all Pokemon data on page load
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`).then((response) => response.json())
    .then((data) => {
        allPokemons = data.results;
        displayPokemons(allPokemons);
    });

// Pre fetch Pokemon data before redirecting to detail page
async function fetchPokemonDataBeforeRedirect(id) {

    try {

        const [pokemon, pokemonSpecies] = await Promise.all(
            [fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
                (res) => res.json()
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(
                (res) => res.json()
            )]
        );

        return true;

    } catch (error) {
        console.error("Failed to fetch pokemon before the redirect")

    }

};

function displayPokemons(pokemon) {

    listWrapper.innerHTML = ""

    pokemon.forEach(pokemon => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
        <div class="number-wrap"> <p class="caption-fonts">#${pokemonID}</p> </div>
        <div class="img-wrap"> 
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap"> <p class="body3-fonts">#${pokemon.name}</p> </div>
        <label class="favorite-container">
        <input type="checkbox" data-pokemon-id="${pokemonID}">
        <svg id="Layer_1" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.4,4C14.6,4,13,4.9,12,6.3C11,4.9,9.4,4,7.6,4C4.5,4,2,6.5,2,9.6C2,14,12,22,12,22s10-8,10-12.4C22,6.5,19.5,4,16.4,4z"></path>
        </svg>
        </label>
        `;

        // Navigate to detail page on card click

        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`;
            }

        });

        listWrapper.appendChild(listItem);

        // favorite checkbox
        const favoriteBtn = listItem.querySelector('.favorite-container');

        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        });


        const checkbox = listItem.querySelector('input[type="checkbox"]');

        if (checkIfFav(pokemonID)) {
            checkbox.checked = true;
            listItem.classList.add("favorited")
        }

        // Handle favorite checkbox changes

        checkbox.addEventListener('change', function () {
            handleFavoriteclick(pokemonID, this.checked);
            if (this.checked) {
                listItem.classList.add("favorited");
            } else {
                listItem.classList.remove("favorited");
            }

            if (favoritesFilter.checked) {
                checkfavorites();
            }



        });
    });


}

favoritesFilter.addEventListener("change", checkfavorites);


searchInput.addEventListener("keyup", handlesearch);

// Filter Pokemon based on search input and active filter

function handlesearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;
    if (numberFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    }
    else if (nameFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm);
        });
    }

    else {
        filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);

    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block"
    }
    else {
        notFoundMessage.style.display = "none"

    }
}

// Clear search input and reset display

closeButton.addEventListener("click", clearSearch)

function clearSearch() {
    searchInput.value = ""
    displayPokemons(allPokemons)
    notFoundMessage.style.display = "none"
}

// Save or remove Pokemon from favorites in localStorage

function handleFavoriteclick(pokemonID, isChecked) {

    let favorites = localStorage.getItem(`favoritePokemon`);
    if (favorites) {
        favorites = JSON.parse(favorites);
    }
    else {
        favorites = [];
    }

    if (isChecked) {
        favorites.push(pokemonID);
    }

    else {

        let index = favorites.indexOf(pokemonID);
        if (index > -1) {
            favorites.splice(index, 1)
        }
    }

    localStorage.setItem(`favoritePokemon`, JSON.stringify(favorites));

}

// Check if a Pokemon is in favorites

function checkIfFav(pokemonID) {
    let favorites = localStorage.getItem(`favoritePokemon`);
    if (favorites) {
        favorites = JSON.parse(favorites);
        return favorites.includes(pokemonID);
    }
    else {
        return false;
    }
}

// Display only favorited Pokemon when favorites filter is active

function checkfavorites() {
    if (favoritesFilter.checked) {
        let favorites = localStorage.getItem('favoritePokemon');

        if (favorites) {
            favorites = JSON.parse(favorites);

            let favoritedPokemons = allPokemons.filter((pokemon) => {
                const pokemonID = pokemon.url.split("/")[6];
                return favorites.includes(pokemonID);
            });

            displayPokemons(favoritedPokemons);

            // Show message if no favorites exist
            if (favoritedPokemons.length === 0) {
                notFoundMessage.textContent = "No favorites yet";
                notFoundMessage.style.display = "block";
            } else {
                notFoundMessage.style.display = "none";
            }

        } else {
            listWrapper.innerHTML = "";
            notFoundMessage.textContent = "No favorites yet";
            notFoundMessage.style.display = "block";
        }

    } else {
        displayPokemons(allPokemons);
        notFoundMessage.style.display = "none";
    }
}
