let pokemonNames = [];
let pokemonNamesNoDash = [];

function removeDashes(name) {
    return name.replace(/-/g, ' ');
}

async function loadPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
        const data = await response.json();
        pokemonNames = data.results.map(pokemon => pokemon.name);
        pokemonNamesNoDash = pokemonNames.map(name => removeDashes(name));
    } catch (error) {
        console.error('Error al cargar nombres de Pokémon:', error);
    }
}

loadPokemonNames();

const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('pokemonSuggestions');

searchInput.addEventListener('input', function () {
    const inputValue = this.value.trim().toLowerCase().replace(/ /g, '-');
    suggestionsList.innerHTML = '';
    if (inputValue.length === 0) return;
    const filteredNames = pokemonNamesNoDash
        .map((name, index) => ({ display: name, original: pokemonNames[index] }))
        .filter(item => item.display.startsWith(inputValue.replace(/-/g, ' ')))
    filteredNames.forEach(item => {
        const option = document.createElement('option');
        option.value = item.display;
        suggestionsList.appendChild(option);
    });
});

document.getElementById('searchButton').addEventListener('click', searchPokemon);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

async function searchPokemon() {
    let searchInputValue = searchInput.value.trim().toLowerCase();
    if (!searchInputValue) return;
    const selectedOption = Array.from(suggestionsList.options).find(option => option.value === searchInputValue);
    const pokemonName = selectedOption && selectedOption.dataset.original ? selectedOption.dataset.original : searchInputValue.replace(/ /g, '-');
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const pokemon = await response.json();
        document.getElementById('pokemonName').textContent = removeDashes(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1));
        document.getElementById('pokemonImage').src = pokemon.sprites.other['official-artwork'].front_default || '';
        document.getElementById('pokemonId').textContent = pokemon.id;
        document.getElementById('pokemonHeight').textContent = `${pokemon.height / 10} m`;
        document.getElementById('pokemonWeight').textContent = `${pokemon.weight / 10} kg`;
        document.getElementById('pokemonTypes').textContent = pokemon.types.map(type => type.type.name).join(', ');
        const modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        modal.show();
        searchInput.value = '';
    } catch (error) {
        alert('Pokémon no encontrado. Por favor, verifica el nombre e intenta de nuevo.');
        console.error('Error:', error);
    }
}
