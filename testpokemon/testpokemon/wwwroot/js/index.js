const URLAPI = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20';
const CONTENIDO = document.getElementById('contenido');

const getPokemons = () => {
    fetch(URLAPI)
        .then(response => response.json())
        .then(datos => {
            let count = 0;
            datos.results.forEach(e => {
                if (count < 20) {
                    showData(e);
                    count++;
                }
            });
        })
        .catch(error => console.log('Error en la petición:', error));
};

const showData = (data) => {
    const idPokemon = data.url.split('/').filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idPokemon}.png`;
    fetch(data.url)
        .then(response => response.json())
        .then(pokemonData => {
            const pokemonType = pokemonData.types[0].type.name;
            const cardClass = getCardClassByType(pokemonType);
            const pokemonCard = `
                <div class="card ${cardClass}" onclick="obtenerId(${idPokemon})" style="background-image: url('${imageUrl}');">
                    <div class="card-info">
                        <p class="title">${data.name}</p>
                    </div>
                </div>
            `;
            CONTENIDO.insertAdjacentHTML('beforeend', pokemonCard);
        })
        .catch(error => console.log('Error al obtener los detalles del Pokémon:', error));
};

const getCardClassByType = (type) => {
    switch (type) {
        case 'grass': return 'grass';
        case 'fire': return 'fire';
        case 'water': return 'water';
        case 'normal': return 'normal';
        case 'fighting': return 'fighting';
        case 'bug': return 'bug';
        case 'flying': return 'flying';
        default: return '';
    }
};

function obtenerId(idPokemon) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('pokemonImage').src = data.sprites.other['official-artwork'].front_default || '';
            document.getElementById('pokemonName').textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            document.getElementById('pokemonId').textContent = data.id;
            document.getElementById('pokemonHeight').textContent = `${data.height / 10} m`;
            document.getElementById('pokemonWeight').textContent = `${data.weight / 10} kg`;
            document.getElementById('pokemonTypes').textContent = data.types.map(type => type.type.name).join(', ');

            new bootstrap.Modal(document.getElementById('pokemonModal')).show();
        })
        .catch(error => console.log('Error al obtener detalles:', error));
}
getPokemons();