// Selecionar elementos
const pokemonList = document.getElementById('pokemonList');
const modal = document.getElementById('pokemonModal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalImage = document.getElementById('modal-image');
const closeButton = document.querySelector('.close-button');
const loadMoreButton = document.getElementById('loadMoreButton');

// Limites de carregamento
const maxRecords = 151;
const limit = 10;
let offset = 0;

// Converter Pokémon para HTML
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" 
            data-name="${pokemon.name}" 
            data-description="Tipos: ${pokemon.types.join(', ')}" 
            data-image="${pokemon.photo}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

// Carregar Pokémon da API e renderizar na lista
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml; // Adiciona os Pokémon à lista
    });
}

// Função para abrir o modal
function openModal(pokemonName, pokemonDescription, pokemonImage) {
    modalTitle.textContent = pokemonName; // Atualiza o título do modal
    modalDescription.textContent = pokemonDescription; // Atualiza a descrição do modal
    modalImage.src = pokemonImage;
    modalImage.alt = `imagem de ${pokemonName}`;
    modal.classList.remove('hidden');
    modal.classList.add('visible'); // Exibe o modal
}

// Função para fechar o modal
function closeModal() {
    modal.classList.remove('visible'); // Esconde o modal
}

// Eventos para fechar o modal
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Evento de clique nos itens da lista
pokemonList.addEventListener('click', (event) => {
    const target = event.target.closest('li'); // Garante que clique no <li> seja capturado
    if (target) {
        const pokemonName = target.getAttribute('data-name'); // Obtém o nome
        const pokemonDescription = target.getAttribute('data-description'); // Obtém a descrição
        const pokemonImage = target.getAttribute('data-image');
        openModal(pokemonName, pokemonDescription, pokemonImage); // Abre o modal com os dados
    }
});

// Inicializar o carregamento dos Pokémon
loadPokemonItens(offset, limit);

// Evento para carregar mais Pokémon
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
