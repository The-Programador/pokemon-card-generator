/* Gerar cards para redes sociais */

const getInput = () => {
    _listNamePokemon = document.getElementsByClassName('search-pokemon')
    for(let _pokemon = 0; _pokemon < _listNamePokemon.length; _pokemon++) {
        getPokemonData(_listNamePokemon[_pokemon].value)
    }
}

const getPokemonData  = _namePokemon => {
    _namePokemon = _namePokemon.toLowerCase()
    //Faz a requisição a API usando fetch, para coleta de informações detalhadas sobre um CEP
    fetch(`https://pokeapi.co/api/v2/pokemon/${_namePokemon}`)
        .then(response => response.json())

        //Requisicão bem sucedida.
        .then(data => {
            //Caso tudo esteja correto.
            filterDataPokemon(data)
        })

        //Requisição mal-sucedia.
        .catch(err => {
            alert('Pokemon não encontrado!');
        });
}

//Filtra os dados
const filterDataPokemon = _content => {
    let info = []
    //Pokemon Name
    let name = _content['name'];
    //Stats
    let stats = [];
    let statsList = _content['stats'];
    for(let stat in statsList) {
        stats.push(statsList[stat]['base_stat']);
    }
    //Image
    let resource = _content['sprites']
    imgURL = resource['other']['dream_world']['front_default']
    info.push(name, imgURL, stats);    
    console.log(info)
    constructCard(info)
}

//Constrói os cards
const constructCard = (_info) => {
    let cardContainer = document.getElementsByClassName('card-container')[0];
    cardContainer.insertAdjacentHTML('beforeend', CARD)

    let cardPokemonTitle = document.getElementsByClassName('card-pokemon-title')[index];
    let pokemonImg = document.getElementsByClassName('pokemon-image')[index];

    let boxStats = document.getElementsByClassName('box-stats')[index];

    for(let pos in _info[2]) {
        let stat = document.createElement('p');
        stat.setAttribute('class', 'stat')
        stat.textContent = _info[2][pos];
        boxStats.appendChild(stat)
    }

    cardPokemonTitle.textContent = _info[0];
    pokemonImg.setAttribute('src', _info[1])
    index++
}

let index = 0

//Entidade Card
const CARD = `
            <div class="card">
                <p class="card-pokemon-title">?</p>
                <div class="card-pokemon-image">
                    <img src="#" class="pokemon-image">
                </div>
                <div class="sub-card">               
                    <div class="box-stats">
                    </div>
                </div>
            </div>
            `