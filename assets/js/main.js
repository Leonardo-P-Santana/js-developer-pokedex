const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml;
        addClickEvents();

    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function showPokemonDetail(pokemon) {
    const detailContainer = document.getElementById('pokemonDetail');

    detailContainer.innerHTML = ` <div class="detail-card ${pokemon.type}">
            <button id="backButton">⬅ Voltar</button>

            <div class="pokemon-header">
                <h2>${pokemon.name} (#${pokemon.number})</h2>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
                <div class="types">
                    ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
                </div>
            </div>

            <div class="pokemon-info">
                <h3>About</h3>
                <ul>
                    <li><strong>Species:</strong> Seed</li>
                    <li><strong>Height:</strong> ${pokemon.height || 'N/A'} m</li>
                    <li><strong>Weight:</strong> ${pokemon.weight || 'N/A'} kg</li>
                    <li><strong>Abilities:</strong> ${pokemon.abilities || 'N/A'}</li>
                </ul>

                <h3>Breeding</h3>
                <ul>
                    <li><strong>Gender:</strong> 87% male / 12% female</li>
                    <li><strong>Egg Group:</strong> Grass</li>
                    <li><strong>Egg Cycle:</strong> 20</li>
                </ul>
            </div>
        </div>
    `;

    pokemonList.style.display = 'none';
    document.querySelector('.pagination').style.display = 'none';
    detailContainer.style.display = 'block';

    document.getElementById('backButton').addEventListener('click', () => {
        detailContainer.style.display = 'none';
        pokemonList.style.display = 'grid';
        document.querySelector('.pagination').style.display = 'block';
    });
}

function addClickEvents() {
    document.querySelectorAll('.pokemon').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${id}` })
                .then(showPokemonDetail);
        });
    });
}