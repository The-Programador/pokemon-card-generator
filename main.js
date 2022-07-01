/* Gerar cards para redes sociais */
const generate = () => {
    let cardContainer = document.getElementsByClassName('card-container')[0];
    cardContainer.innerHTML = '';
    let inputPokemon = document.getElementsByClassName('search-pokemon')
    for(let position = 0; position < inputPokemon.length; position++) {
        cardContainer.insertAdjacentHTML('beforeend', CARD)
    }
    search()
}

const search = () => {
    let inputPokemon = document.getElementsByClassName('search-pokemon')
    for(let position = 0; position < inputPokemon.length; position++) {
        getPokemonData(inputPokemon[position].value.toLowerCase(), position)
    }
    //setTimeout(show, 98) //Não muito útil :/
}

const getPokemonData  = (_namePokemon, id) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${_namePokemon}`)
        .then(response => response.json())
        //Requisicão bem sucedida.
        .then(data => {
            //Caso tudo esteja correto.            
            constructCard(filterDataPokemon(data), id)
        })
        //Requisição mal-sucedia ou outro erro.
        .catch(err => {
            showError()
        })
}

const filterDataPokemon = _content => {
    let info = []
    //Basic informations
    let name = _content.name;
    let order = _content.id;
    let urlSpecie = _content.species.url //Outro endpoint da API
    let types = _content.types;
    let weight = _content.weight / 10 //Hectograma para Kilograma
    let height = _content.height / 10 //Decimêtro para Metro
    //Stats
    let stats = []; //Vai receber as estatísticas básicas
    let statsList = _content.stats;
    for(let stat in statsList) {
        stats.push(statsList[stat].base_stat);
    }
    //Image
    let resource = _content.sprites
    let imgURL1 = resource.other.dream_world.front_default;
    let imgURL2 = resource.other['official-artwork'].front_default;
    let imgURL = imgURL1 === null ? imgURL2:imgURL1;
    info.push(name, imgURL, stats, order, weight, height, urlSpecie, types);
    return info;
}


const constructCard = (_info, id) => {
    fetch(_info[6])
    .then(response =>
        response.json())
    .then(data => {
        let color = data['color']['name']
        if(color == 'white') {
            color = '#ebebeb'
        }
        cardBackground.style.backgroundColor = color
    })
    .catch(error => {
        cardBackground.style.backgroundColor = 'lightgray'
    })

    //Criar div e inserir elementos por adjascentHTML
    let cards = document.getElementsByClassName('card')
    let cardBackground = document.createElement('div')
    let cardPokemonTitle = document.createElement('p')
    let cardPokemonImage = document.createElement('div')
    let pokemonImage = document.createElement('img')
    let subCard = document.createElement('div')
    let subCardInfoBio = document.createElement('div')
    let subCardInfoBioLevel1 = document.createElement('div')
    let left = document.createElement('div')
    let right = document.createElement('div')
    let type = document.createElement('p')
    let weaknessBox = document.createElement('div')
    let weakness = document.createElement('div')
    let weaknessBoxTitle = document.createElement('div')
    let weightPokemon = document.createElement('p')
    let heightPokemon = document.createElement('p')
    let boxStats = document.createElement('div')
    let boxStatsTitle = document.createElement('p')
   
    cardBackground.className = 'card-background'
    cardPokemonTitle.className = 'card-pokemon-title';
    cardPokemonImage.className = 'card-pokemon-image';
    pokemonImage.className = 'pokemon-image';
    subCardInfoBio.className = 'sub-card-info-bio'
    subCardInfoBioLevel1.className = 'bio-level1'
    type.className = 'type';
    weaknessBox.className = 'weakness-box'
    weaknessBoxTitle.className = 'weakness-box-title'
    weakness.className = 'weakness'
    weightPokemon.className = 'weight-pokemon';
    heightPokemon.className = 'height-pokemon';
    subCard.className = 'sub-card';
    boxStats.className = 'box-stats';
    boxStatsTitle.className = 'box-stats-title'
    //boxStatsTitle.className = 'box-stats-title'

    let statsList = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special-Defence', 'Speed']

    boxStatsTitle.textContent = 'Stats';
    boxStats.appendChild(boxStatsTitle);

    //Constrói as Stats
    for(let pos in _info[2]) {
        //Define o Elementos
        let nameStat = document.createElement('span')
        let bar = document.createElement('span')
        let barMin = document.createElement('span')
        let stat = document.createElement('p');
        //Define as Classes
        nameStat.className = 'name-stat'
        bar.className =  'bar';
        barMin.className =  'bar-min';
        stat.className = 'stat';
        //Atribui os valores das stats e adiciona sub-área
        nameStat.insertAdjacentHTML("beforeend",`<span>${statsList[pos]}</span> <span class="stats-value">${_info[2][pos]}</span>`)
        barMin.style.width = `${_info[2][pos]*1.7}px`;
        bar.appendChild(barMin)
        boxStats.appendChild(stat)
        stat.appendChild(nameStat)
        stat.appendChild(bar)
    }

    weaknessBoxTitle.insertAdjacentHTML('beforeend', `<p>weakness</p>`)

    type.insertAdjacentHTML('beforeend', `<span class="type-title">Type</span>`)
    //Type Pokémon
    for(let indice in _info[7]){
        type.insertAdjacentHTML('beforeend', `<span class="${_info[7][indice].type.name}">${_info[7][indice].type.name}</span>`)

        console.log(_info[7][indice].type.name)
        
        fetch(_info[7][indice].type.url)
        .then(response => response.json())
        .then(data => {
            data.damage_relations.double_damage_from.forEach((damage) => {
                if(_info[7][indice].type.name !== damage)
                    weakness.insertAdjacentHTML('beforeend', `<span class="${damage.name}">${damage.name}</span>`)
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    weightPokemon.insertAdjacentHTML('beforeend', `<span>Weight:</span> <span>${_info[4]}kg</span>`);

    heightPokemon.insertAdjacentHTML('beforeend', `<span>Height:</span> <span>${_info[5]}m</span>`);
    
    cardPokemonTitle.textContent = `${_info[0]} #${_info[3]}`;
    pokemonImage.setAttribute('src', _info[1])
    cardPokemonImage.appendChild(pokemonImage)
    right.appendChild(type)
    left.appendChild(weightPokemon)
    left.appendChild(heightPokemon)
    weaknessBox.appendChild(weaknessBoxTitle)
    weaknessBox.appendChild(weakness)
    subCardInfoBioLevel1.appendChild(left)
    subCardInfoBioLevel1.appendChild(right)
    subCardInfoBio.appendChild(subCardInfoBioLevel1)
    subCardInfoBio.appendChild(weaknessBox)
    subCard.appendChild(boxStats);

    cards[id].innerHTML = '';
    cards[id].appendChild(cardBackground)
    cards[id].appendChild(cardPokemonTitle)
    cards[id].append(cardPokemonImage)
    cards[id].appendChild(subCardInfoBio)
    cards[id].append(subCard)
    //cards[id].className = 'card'

    if(id === 1) {
        show()
    }
    pokemonCardCompare(_info, id)
}

let ocorrency = 0
let ocorrencyFetch = 0
let pokemonCompare = []
typesCompare1 = []
typesCompare2 = []
let nameType1 = []
let nameType2 = []
let points1 = 0
let points2 = 0

const pokemonCardCompare = (info, id) => {
    ocorrency++
    let statsTotal = 0
    info[2].forEach( (stat) => {
        statsTotal += stat
    })

    let name = info[0]
    pokemonCompare.push([name, statsTotal])

    for(let indice in info[7]){

        if (id === 0) {
            nameType1.push(info[7][indice].type.name)
        }

        if (id === 1) {
            nameType2.push(info[7][indice].type.name)
        }

        //Realiza as requisições de relação de dano duplo dos pokémons
        fetch(info[7][indice].type.url)
        .then(response => response.json())
        .then(data => {
            ocorrencyFetch++
            data.damage_relations.double_damage_from.forEach((damage) => {
                if(id === 0) {
                    typesCompare1.push(damage.name)
                }else if (id === 1) {
                    typesCompare2.push(damage.name)
                }
            })

            if (ocorrencyFetch == 2) {
                ocorrencyFetch = 0
                typesCompare1.forEach((weakness) => {
                    if (nameType2.includes(weakness)) {
                        console.log(`fraqueza identificada no número 1, ${weakness}`)
                        points2 += 100
                    }else {
                        console.log('Nenhuma fraqueza para o primeiro')
                    }
                })
                typesCompare2.forEach((weakness) => {
                    if (nameType1.includes(weakness)) {
                        console.log(`fraqueza identificada no número 2, ${weakness}`)
                        points1 += 100
                    } else {
                        console.log('Nenhuma fraqueza para o segundo')
                    }
                })
                pokemonCompare[0][1] += points1
                pokemonCompare[1][1] += points2
                let winner = pokemonCompare[0][1] > pokemonCompare[1][1] ? pokemonCompare[0]:pokemonCompare[1];
                let loser = pokemonCompare[0][1] < pokemonCompare[1][1] ? pokemonCompare[0]:pokemonCompare[1];
                let cardContainer = document.getElementsByClassName('card-container')[0];
                let comparisonBox = document.createElement('div')
                comparisonBox.className = 'comparison-box'
                let pokemon1 = document.createElement('p')
                let pokemon2 = document.createElement('p')
                pokemon1.insertAdjacentHTML('beforeend', `<span>${pokemonCompare[0][0]}</span>: total <span>${pokemonCompare[0][1]}</span> pontos (<span>${points1} pontos de vantagem no tipo</span>)`)

                pokemon2.insertAdjacentHTML('beforeend', `<span>${pokemonCompare[1][0]}</span>: total <span>${pokemonCompare[1][1]}</span> pontos (<span>${points2} pontos de vantagem no tipo</span>)`)
                
                let result = document.createElement('p')
                result.className = 'result-comparison'
                result.insertAdjacentHTML('beforeend', `<span>${winner[0]}</span> <span> é superior ao </span> <span>${loser[0]}</span>`)
                comparisonBox.innerHTML = ''
                comparisonBox.appendChild(pokemon1)
                comparisonBox.appendChild(pokemon2)
                comparisonBox.appendChild(result)
                cardContainer.appendChild(comparisonBox)
                ocorrency = 0
                ocorrencyFetch = 0
                pokemonCompare = []
                typesCompare1 = []
                typesCompare2 = []
                nameType1 = []
                nameType2 = []
                points1 = 0
                points2 = 0
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    //Realiza de fato a comparação dos pokémons
    if(ocorrency == 2) {
    }
    
}

const showError = () => {
    let cardContainer = document.getElementsByClassName('card-container')[0];
    cardContainer.innerHTML = ''
    let boxError = document.createElement('div')
    boxError.className = 'box-error'
    boxError.insertAdjacentHTML('beforeend', `<p class="msg-error">Algum Recurso Solicitado Não Existe!</p>`)
    cardContainer.appendChild(boxError)
}

const show = () => {
    let cards = document.getElementsByClassName('card')
    cards.item(0).className = 'card';
    cards.item(1).className = 'card';
}

//Card Pokémon
const CARD = `<div class="card hidden">
                <p>Pokémon!!</p>
              </div>
        `

let button = document.getElementsByClassName('button')[0]
button.addEventListener('click', generate)