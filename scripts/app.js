// Let's make a pokedex!
// Get all the gen 1 pokemon from https://pokeapi.co/
// Display them in order of id on the main screen
// Make each pokemon a clickable button
// Display the stats of the selected pokemon
// Create a back button to go back to the Pokemon list

// Extra
// Add a spatk button
// Add a growl button to lower opponent's atk
// Add a spinner for loading



const app = {} // creating the app object
app.pokemonArray = [] // array to store all pokemon data
app.selectedPokemon = { // array to store data of the selected pokemon
    weaknessArray: [],
    strengthArray: [],
}
app.computerSelectedPokemon = { // array to store data of the computer randomly selected pokemon
    weaknessArray: [],
    strengthArray: [],
}

app.dmgModifier = 1 // this will be used to apply a defense bonus later on
app.actingPokemon = "" // this determines if the player or the computer is acting to calculate damage
app.nonActingPokemon = "" // this is to identify the recipient of the damage
app.actor = "" // this determines if player or computer goes first based on selected Pokemon's speed stat





// -------------------------------------- Display start screen while getPokemon runs --------------------------------

app.startScreen = function() { // initial screen to present the rules of the game

    app.$startScreen.html(`
    
    <div class = "startScreenContainer">
        <div class = "startScreenMessage">
            <p>Hello, Pokemon Trainer! Welcome to this pokemon battle training simulator. In this simulator, you will select a Pokemon to battle against the computer. Here is how the simulator works:</p>
            <ul>
                <li>You will be presented with all 151 of the gen 1 Pokemon (the only ones that actually matter)</li>
                <li>Select a Pokemon to its type, stats, strengths and weaknesses</li>
                <li>Once you confirm the selected Pokemon, you will be entered into a battle against the computer</li>
                <li>The battle mechanics are simplified, Pokemon do not have moves (since it would take more time than I have to program the effects). Instead, you will only have the options: "Attack", "Special Attack", "Defend", and "Run"</li>
            </ul>
            <p>When you're ready, press the 'Start' button below to begin!</li>
        </div>

        <div class = "startButtonContainer">
            <button class = "startButton">Start</button>
        </div>
    </div>
    `)



}


app.startButtonListener = function() { // event listener for the start button

    $(".startButton").unbind().on("click", function() {
        app.$startScreen.hide() // once clicked, start screen will be hidden...
        app.displayPokemonList() // and displayPokemonList will be called
    })
}



// ---------------------- Get the data from pokeapi.co for all of the gen 1 pokemon -----------------------------------


app.getPokemon = function() { // this uses AJAX to get the first 151 pokemon from the pokeapi website

    const individualPokemonDataPromises = Array.from(Array(151).keys()).map(function(index) { // create an array of 151 elements

        return $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${index + 1}`,
            method: "GET",
            dataType: "json",
        })

    })

    Promise.all(individualPokemonDataPromises).then(function(pokemonData) { // wait for all promises to resolve

        app.pokemonArray = pokemonData // store the array from the api into the local pokemonArray
        app.pokemonArray.sort((a, b) => parseInt(a.id) - parseInt(b.id)) // sort the Pokemon list in order of their id

    })

}



// ---------------------------------------- Display all gen 1 pokemon on the main page -----------------------------------

app.displayPokemonList = function() { // function to display the Pokemon list

    app.$results.addClass("pokemonList") // adding the class for Pokemon list

    app.pokemonArray.forEach(function(pokemon) { // for each pokemon in the array, display their front_default sprite

        let pokemonList = `
            <div class="pokemonButton">
                <button id="${pokemon.id}" class = "selectPokemonButton">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" id="${pokemon.id}"class="sprite"/>
                </button>
            </div>
            `
            app.$results.append(pokemonList) // append the template to the page
    })
    
    app.$selectPokemonButton = $(".selectPokemonButton") // const for all the select Pokemon buttons

    app.selectPokemonListener() // start the event listener for all select Pokemon buttons

}




// -------------------------------------- Listener for pokemon selection button ----------------------------------------------

app.selectPokemonListener = function() { // event listener to listen for the Pokemon that is selected


    app.$selectPokemonButton.on("click", function(pokemonId) { // on click, select the id matching the name of the pokemon that was passed from app.pokemonList

        app.$results.removeClass("pokemonList") // remove the pokemonList class
        app.$results.empty() // clear the page

        app.displayPokemonData(pokemonId.target.id - 1) // pass the arguments to app.pokemonData

    })
    
}




// ------------------------------------ Display the selected pokemon's detailed stats ----------------------------------


app.displayPokemonData = function(id) { // display detailed info of the selected Pokemon

    app.$results.addClass("detailedPokemonInfo") // add class for the detailed info page

    app.selectedPokemon.weaknessArray = [] // clear the arrays at the beginning for when a new Pokemon is selected
    app.selectedPokemon.strengthArray = []
    
    $.ajax({ // AJAX call to get the weakness and strength of the selected pokemon
        url: app.pokemonArray[id].types[0].type.url,
        method: "GET",
        dataType: "json"
    }).then(function(types){
        types.damage_relations.double_damage_from.forEach(function(weakness) { // for each item in the array...

            app.selectedPokemon.weaknessArray.push(weakness.name) // push into the weaknessArray

        });
        types.damage_relations.half_damage_from.forEach(function(strength){ // repeat for strength array
            app.selectedPokemon.strengthArray.push(strength.name)
        })

        
    let pokemonData = // set up template for displaying detailed pokemon data

    // show the pokemon front_default sprite, name, and type
    `
        <div class="pokemonBox">
            
            <div class="pokemonImage">
                <img src="${app.pokemonArray[id].sprites.front_default}" alt="${app.pokemonArray[id].name}" class="detailedSprite"/>
            </div>
            
            <p class="pokemonName">${app.pokemonArray[id].name}</p>
            <p class="pokemonType">${app.pokemonArray[id].types[0].type.name}</p>
        
        </div>

        <div class="statsBox">
            <button class="statsButton">Stats</button>
    `

    // for loop to add all elements from the stat array

    for(let i = 0; i < app.pokemonArray[id].stats.length; i++) {
        pokemonData += `<p class="pokemonStats">${app.pokemonArray[id].stats[i].base_stat} ${app.pokemonArray[id].stats[i].stat.name}</p>`
    }
            
        pokemonData += 
        `</div>`
        
        pokemonData += 
        `
        <div class="weakStrongBox">
            
            <button class="weakStrongButton">Effectiveness</button>

            <div class = "pokemonWeakStrong">
        
                <div class = "pokemonWeakAgainst">
                    
                    <h2>Weak Against</h2>`
        
                    // add the weakness array from the AJAX call

                    pokemonData += `<p>${app.selectedPokemon.weaknessArray}</p>`                    

        
                pokemonData += 
                `</div>`


                pokemonData += `
                <div class = "pokemonStrongAgainst">
                    
                    <h2>Strong Against</h2>`
            
                    // add the strength array from the AJAX call

                    pokemonData += `<p>${app.selectedPokemon.strengthArray}</p>`

                pokemonData += 
                `
                </div>
                `
        
            pokemonData += 
            `
            </div>
            `
    
        pokemonData += 
        `
        </div>
        <div class = "chooseOrBackContainer">
            <button class="chooseThisPokemon">Choose this Pokemon!</button>
            <button class="backToMain">Go Back</button>
        </div>
        </div>
        `


    app.$results.append(pokemonData) // append the template to the results

    app.detailedStatsButtonsListener() // turn on event listener for the "Stats" and "Effectiveness" buttons
    app.backToMainButton() // turn on event listener to go back to Pokemon list
    app.chooseThisPokemonListener(id) // turn on event listener to confirm the selected Pokemon

    })
    
}




// --------------------------------- Listener for returning to main page button -----------------------------------------

app.backToMainButton = function() { // event listener for return to Pokemon list 

    app.$backToMain = $(".backToMain")

    app.$backToMain.on("click", function() {

        app.$results.empty() // clear the results
        app.$results.removeClass("detailedPokemonInfo") // remove detailed pokemon info class
        app.displayPokemonList() // call displayPokemonList

    })

}



// ----------------------------- Listener for Choose this Pokemon! button --------------------------------------------

app.chooseThisPokemonListener = function(id) { // event listener for confirming the selected Pokemon

    $(".chooseThisPokemon").on("click", function() {

        app.$results.removeClass("detailedPokemonInfo") // remove detailed pokemon info class
        app.loadChosenPokemon(id) // call loadChosenPokemon

    })

}


// ----------------------------------- Load selected Pokemon on arena --------------------------------------------

app.loadChosenPokemon = function(id) { // loads the stats of the player selected pokemon into the selectedPokemon object

    app.selectedPokemon.name = app.pokemonArray[id].name
    app.selectedPokemon.sprite = app.pokemonArray[id].sprites.back_default
    app.selectedPokemon.type = app.pokemonArray[id].types[0].type.name
    app.selectedPokemon.hp = app.pokemonArray[id].stats[0].base_stat
    app.selectedPokemon.atk = app.pokemonArray[id].stats[1].base_stat
    app.selectedPokemon.def = app.pokemonArray[id].stats[2].base_stat
    app.selectedPokemon.spatk = app.pokemonArray[id].stats[3].base_stat
    app.selectedPokemon.spdef = app.pokemonArray[id].stats[4].base_stat
    app.selectedPokemon.spd = app.pokemonArray[id].stats[5].base_stat

    app.loadComputerChosenPokemon() // calls loadComputerChosenPokemon
}



// ----------------------------------- Computer chooses a random pokemon -----------------------------------------

app.loadComputerChosenPokemon = function() { // computer randomly selects a Pokemon and loads the stats into the computerSelectedPokemon object

    const computerRandomId = Math.floor(Math.random()*151 + 1) // generate a random nubmer between 1 and 151

    app.computerSelectedPokemon.id = computerRandomId // computer selects random pokemon based on generated id

    $.ajax({ // AJAX call to get the weakness and strengths of the computer selected Pokemon
        url: app.pokemonArray[app.computerSelectedPokemon.id].types[0].type.url,
        method: "GET",
        dataType: "json"
    }).then(function(types){
        types.damage_relations.double_damage_from.forEach(function(weakness) { // for each item in the array...

            app.computerSelectedPokemon.weaknessArray.push(weakness.name) // push into the weaknessArray

        });
        types.damage_relations.half_damage_from.forEach(function(strength){ // repeat for strength
            app.computerSelectedPokemon.strengthArray.push(strength.name)
        })
    })

    // then load all the stats into the computerSelectedPokemon object

    app.computerSelectedPokemon.name = app.pokemonArray[app.computerSelectedPokemon.id].name
    app.computerSelectedPokemon.sprite = app.pokemonArray[app.computerSelectedPokemon.id].sprites.front_default
    app.computerSelectedPokemon.type = app.pokemonArray[app.computerSelectedPokemon.id].types[0].type.name
    app.computerSelectedPokemon.hp = app.pokemonArray[app.computerSelectedPokemon.id].stats[0].base_stat
    app.computerSelectedPokemon.atk = app.pokemonArray[app.computerSelectedPokemon.id].stats[1].base_stat
    app.computerSelectedPokemon.def = app.pokemonArray[app.computerSelectedPokemon.id].stats[2].base_stat
    app.computerSelectedPokemon.spatk = app.pokemonArray[app.computerSelectedPokemon.id].stats[3].base_stat
    app.computerSelectedPokemon.spdef = app.pokemonArray[app.computerSelectedPokemon.id].stats[4].base_stat
    app.computerSelectedPokemon.spd = app.pokemonArray[app.computerSelectedPokemon.id].stats[5].base_stat

    app.displayBattleScreen() // start battle

}




// ------------------------------------ Load player and computer selected pokemon to battle ------------------------


app.displayBattleScreen = function() { // start the battle sequence

    app.$results.empty() 
    app.$results.removeClass("detailedPokemonInfo")
    app.$results.addClass("battleScreen")

    let battleScreen =  // template for the battle screen

    // player selected pokemon back_default sprite, name, and hp will be displayed against the computer's front_default, name, and hp

    // attack, special attack, defend, and run buttons will be displayed
    `
    <div class = "playerPokemon">
        <img src = "${app.selectedPokemon.sprite}" alt = "app.selectedPokemon.name" class = "playerBattlePokemon"/>
        <p class = "selectedPokemonHp">HP: <span id = "selectedPokemonHp">${app.selectedPokemon.hp}</span></p>
    </div>

    <div class = "computerPokemon">
        <img src = "${app.computerSelectedPokemon.sprite}" class = "computerBattlePokemon"/>
        <p class = "computerSelectedPokemonHp">HP: <span id = "computerSelectedPokemonHp">${app.computerSelectedPokemon.hp}</span></p>
    </div>

    <div class = "break"></div>

    <div class = "battleContainer">
        <div class = "battleTextContainer">
            <p class = "battleTextContainer"></p>
        </div>
        <div class = "battleButtons">
            <button class = "attack">Attack</button>
            <button class = "spAtk">Sp. Attack</button>
            <button class = "defend">Defend</button>
            <button class="backToMain" id="run">Run</button>
        </div>
    </div>

    `

    

    app.$results.html(battleScreen)

    app.initiative() // calls initiative function
}




// ----------------------------------------- Calculate initiative -----------------------------------------

app.initiative = function() { // this function will determine if player or computer goes first depending on the respective Pokemon speed stat

    if (app.selectedPokemon.spd > app.computerSelectedPokemon.spd) { // if player's pokemon has higher speed
        app.actor = "player" // player goes first
    } else if (app.selectedPokemon.spd < app.computerSelectedPokemon.spd) { // vice versa for computer pokmeon
        app.actor = "computer"
    } else {
        app.actor = "player" // if both pokemon has same speed, let player go first
    }

app.battleOrder()

}



// -------------------------------------------- Battle order ------------------------------------------------

app.battleOrder = function() { // set the battle order
    
    app.$attack = $(".attack") // const for the 3 buttons
    app.$spAtk = $(".spAtk")
    app.$defend = $(".defend")
    app.$battleTextContainer = $(".battleTextContainer")
    app.$battleButtons = $(".battleButtons")

    app.$battleButtons.hide() // hide the buttons after the player has selected one of them
    app.backToMainButton() 

    
    if(app.actor === "player") { // player's turn
        app.$battleTextContainer.text(`What will ${app.selectedPokemon.name.toUpperCase()} do?`)
        app.$battleButtons.show() // wait for user input
        app.actingPokemon = app.selectedPokemon // set actor as player's Pokemon
        app.nonActingPokemon = app.computerSelectedPokemon // set non actor as computer's Pokemon
        app.actor = "computer" // change to computer's turn 
        app.battleScreenButtonsListener() // listen for player input atk or def button
    } else if (app.actor === "computer") { // computer's turn
        app.$battleTextContainer.text(`Computer's turn`)
        app.nonActingPokemon = app.selectedPokemon // set actor as computer's Pokemon
        app.actingPokemon = app.computerSelectedPokemon // set non actor as player's Pokemon
        app.actor = "player" // change to player's turn next round

        setTimeout(() => {
            app.$battleTextContainer.text(`Computer's ${app.computerSelectedPokemon.name.toUpperCase()} attacks!`)

            setTimeout(() => {
                app.damageCalculations() // auto-run computer Pokemon's damage calculations
            }, 2000);
            
        }, 2000);
    }


}




// ------------------------------------- Battle screen button listeners -----------------------------------------

app.battleScreenButtonsListener = function() { // event listener for the buttons on the battle screen

    app.$attack.unbind().on("click", function() { // attack button
        app.$battleTextContainer.text(`Player's ${app.selectedPokemon.name.toUpperCase()} attacks!`)
        app.dmgModifier = 1 // dmgModifier is to calculate when a player chooses defend, so this will be 1 for attack
        let atkType = 0 // atkType calculates whether the player used attack or special attack
        setTimeout(() => {
            app.damageCalculations(atkType) // pass the atkType to damageCalculations function
        }, 2000);
        app.$battleButtons.hide() // hide the buttons while the turn resolves
    })
    
    app.$spAtk.unbind().on("click", function() { // special button
        app.$battleTextContainer.text(`Player's ${app.selectedPokemon.name.toUpperCase()} attacks!`)
        app.dmgModifier = 1
        let atkType = 1 // atkType is 1 to differentiate from normal attack
        setTimeout(() => {
            app.damageCalculations(atkType)
        }, 2000);
        app.$battleButtons.hide()
    })

    app.$defend.unbind().on("click", function() { // defend button
        app.$battleTextContainer.text(`Player's ${app.selectedPokemon.name.toUpperCase()} defends!`)
        app.dmgModifier = 0.5 // applies a 0.5 dmgModifier so the damage received by the plaeyr's Pokemon is halved
        app.actor = "computer" // computer goes next
        setTimeout(function() {
            app.battleOrder()
        }, 2000);
        app.$battleButtons.hide()
    })

}





// ----------------------------------------------------- Damage calculations --------------------------------------

app.damageCalculations = function(atkType) { // calculates the damage for the turn, takes the atkType to determine if attack or special attack is selected

    let attack = app.actingPokemon.atk // set attack value to acting Pokemon's attack stat
    let defense = app.nonActingPokemon.def // set defense value to acting Pokemon's defense stat
    let effectiveness = 1 // set effectiveness variable to determine if damage is super effective or not effective

    if (atkType === 0) { // if normal attack, then no effects are applied
        attack = app.actingPokemon.atk
        defense = app.nonActingPokemon.def
    } else if (atkType === 1 || app.actingPokemon === app.computerSelectedPokemon) { // else if special attack or if computer attacks (computer attacks will always account for type effectiveness)
        attack = app.actingPokemon.spatk
        defense = app.nonActingPokemon.spdef

        if (app.nonActingPokemon.weaknessArray.includes(app.actingPokemon.type)) { // if the acting pokemon type is included in the non-acting Pokemon's weakness list, then
            effectiveness = 2 // double damage
        } else if (app.nonActingPokemon.strengthArray.includes(app.actingPokemon.type)){ // if the acting pokemon type is included in the non-acting Pokemon's strength list, then
            effectiveness = 0.5 // half damage
        } else {
            effectiveness = 1 // normal damage
        }
    }


    let hitChance = Math.round(Math.random() + 0.35) // calculate hit chance biased towards higher hit chance

    const damage = Math.floor((600*(attack/defense)/50) * effectiveness * (Math.random()*38 + 217)/255 * hitChance * app.dmgModifier) // simplified version of gen 1 damage calculation
    

    app.nonActingPokemon.hp -= damage // subtract from hp

    console.log(app.selectedPokemon, app.computerSelectedPokemon, attack, defense, "effect " + effectiveness, "damage " + damage, "hit " + hitChance, "remaining hp " + app.nonActingPokemon.hp, "damage modifier " + app.dmgModifier)


    if(app.nonActingPokemon.hp <= 0) { // prevents hp from going below 0 on the page
        app.nonActingPokemon.hp = 0
    }

    $("#selectedPokemonHp").text(Math.floor(app.selectedPokemon.hp)) // shows rounded down hp of player Pokemon
    $("#computerSelectedPokemonHp").text(Math.floor(app.computerSelectedPokemon.hp)) // of computer Pokemon


    if(hitChance === 0) { // if missed
        app.$battleTextContainer.text(`${app.actingPokemon.name.toUpperCase()} missed`)
        setTimeout(function() {
            app.battleOrder() // no damage applied and go to next turn
        }, 2000);
    } else {
        
        app.$battleTextContainer.text(`${app.nonActingPokemon.name.toUpperCase()} takes ${damage} damage!`)

        if(effectiveness === 2){ // if super effective
            setTimeout(() => {
                app.$battleTextContainer.text("It's super effective!")
                setTimeout(() => {
                    app.checkLose() // check if either Pokemon has fainted
                }, 2000);
            }, 2000);
            } else if (effectiveness === 0.5) { // if not effective
                setTimeout(() => {
                    app.$battleTextContainer.text("It's not very effective...")
                    setTimeout(() => {
                        app.checkLose()
                    }, 2000);
                }, 2000);
            } else { // if no type effectiveness
                setTimeout(() => {
                    app.checkLose()
                }, 2000);
            }
            
        
    }

}




// ----------------------------------------- Check if either pokemon has fainted ------------------------------

app.checkLose = function() { // check if either Pokemon has fainted at the end of each round

    if(app.selectedPokemon.hp <= 0) { // if plaeyr pokemon fainted
        app.selectedPokemon.hp = 0
        app.$battleTextContainer.text(`${app.selectedPokemon.name.toUpperCase()} fainted. Player loses.`)
        setTimeout(() => {
            app.$battleTextContainer.text("Returning to Pokemon selection")
        }, 2000);
        setTimeout(() => {
            app.$results.empty()
            app.$results.removeClass("battleScreen")
            app.displayPokemonList() // back to Pokemon list
        }, 4000);
    } else if (app.computerSelectedPokemon.hp <= 0) { // if computer pokemon fainted
        app.computerSelectedPokemon.hp = 0
        app.$battleTextContainer.text(`${app.computerSelectedPokemon.name.toUpperCase()} fainted. Player wins!`)
        setTimeout(() => {
            app.$battleTextContainer.text("Returning to Pokemon selection")
        }, 2000);
        setTimeout(() => {
            app.$results.empty()
            app.$results.removeClass("battleScreen")
            app.displayPokemonList()
        }, 4000);
    } else { // if neither pokemon fainted
        app.battleOrder()
    }    
    
}





// -------------------------------------- Buttons for displaying stats and effectiveness ----------------------------

app.detailedStatsButtonsListener = function() { // event listener for the detailed pokemon page

    $(".statsButton").on("click", function() { // show the pokemon stats
        $(".pokemonStats").toggleClass("flex")
    })

    $(".weakStrongButton").on("click",function() { // show the pokemon effectiveness
        $(".pokemonWeakStrong").toggleClass("flex")
    })

}

// app.$selectPokemonButton = $(".selectPokemonButton")

// ------------------------------------------------- Init ----------------------------------------------------------


app.init = function() {

    app.$startScreen = $(".startScreen")
    app.$results = $(".results")
    app.$pokemonList = $(".pokemonList")
    
    app.startScreen()
    app.startButtonListener()
    app.getPokemon()
}


// ------------------------------- Document Ready -----------------------------------------

$("document").ready(function() {
    app.init()
})

