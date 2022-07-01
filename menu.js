function showMenu(id) {
    let boxmenu = document.getElementsByClassName('menu')[id];
    console.log(boxmenu)
    boxmenu.className = 'menu'
    showElements(id)
}

let listNamePokemon = []
async function showElements(id) {
    let box = document.getElementsByTagName('input')[id];
    let boxmenu = document.getElementsByClassName('menu')[id];
    if(flag) {
        await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => response.json())
        .then(data => {
            box.addEventListener('focusout', (id) => setTimeout(function(){
                boxmenu.className = 'menu hidden-menu'
            }, 120))
            for(let pokemon in listNamePokemon)  {
                let p = document.createElement('option')
                p.innerText = listNamePokemon[pokemon]
                p.addEventListener('click', () => {
                    box.value = p.innerText; 
                    hideMenu(id);
                })
                boxmenu.appendChild(p)
                //boxmenu.insertAdjacentHTML('beforeend', `<p><a href="#">${data.results[pokemon].name}</p></a>`)
            }
        })
        .catch(err => {
            console.log(err)
        })

    } else {
        await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => response.json())
        .then(data => {
            listNamePokemon = []
            box.addEventListener('focusout', (id) => setTimeout(function(){
                boxmenu.className = 'menu hidden-menu'
            }, 120))
            for(let pokemon in data.results)  {
                let p = document.createElement('option')
                p.innerText = data.results[pokemon].name
                p.addEventListener('click', () => {
                    box.value = p.innerText; 
                    hideMenu(id);
                })
                boxmenu.appendChild(p)
                //boxmenu.insertAdjacentHTML('beforeend', `<p><a href="#">${data.results[pokemon].name}</p></a>`)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
}

let flag = true

async function loadNamePokemon(id) {
    await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then(response => response.json())
    .then(data => {
        for(let pokemon in data.results)  {
            listNamePokemon.push(data.results[pokemon].name)
        }
        console.log('Load NAme pokemon true')
    })
    .catch(err => {
        flag = false
    })
}

loadNamePokemon()

const filterName = (id) => {
    let box = document.getElementsByTagName('input')[id];
    let boxValue = document.getElementsByTagName('input')[id].value;
    let boxmenu = document.getElementsByClassName('menu')[id];
    boxmenu.innerHTML = ''
    box.addEventListener('focusout', (id) => setTimeout(function(){
        boxmenu.className = 'menu hidden-menu'
    }, 200))
    
    let newListNamePokemon = listNamePokemon.filter((name) => {
        return name.includes(boxValue)
    })

    for(let pokemonName in newListNamePokemon)  {
        let p = document.createElement('option')
        p.innerText = newListNamePokemon[pokemonName]
        p.addEventListener('click', () => {
            box.value = p.innerText; 
            hideMenu(id);
        })
        boxmenu.appendChild(p)
        boxmenu.className = 'menu'
    }
    console.log(listNamePokemon)
}

function hideMenu(id) {
    let boxmenu = document.getElementsByClassName('menu')[id];
    boxmenu.className = 'menu hidden-menu'
}

let input1 = document.getElementsByTagName('input')[0];
input1.addEventListener('focus', () => showMenu(0));
let input2 = document.getElementsByTagName('input')[1];
input2.addEventListener('focus', () => showMenu(1));

input1.addEventListener('input', (id) => {id = 0; filterName(id)})
input2.addEventListener('input', (id) => {id = 1; filterName(id)})