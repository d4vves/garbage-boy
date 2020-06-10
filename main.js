document.addEventListener('DOMContentLoaded', () => {

    /*----- DOM Refs -----*/
    let startBtn = document.getElementById('start-btn')
    let intro = document.getElementById('intro')
    let main = document.getElementById('main')
    let stageText = document.getElementById('stage')
    let healthText = document.getElementById('health')
    let game = document.getElementById('game')
    let retryBtn = document.getElementById('retry-btn')
    game.width = 800
    game.height = 400
    let ctx = game.getContext('2d')

    /*----- Create character sprites -----*/
    let garbageImg = new Image()
    garbageImg.src = 'img/garbage.png'
    let gbImg = new Image()
    gbImg.src = 'img/garbageboy.png'
    let bottleImg = new Image()
    bottleImg.src = 'img/bottle.png'
    let ratImg = new Image()
    ratImg.src = 'img/rat.png'

    /*----- Variable Declarations -----*/
    // Game piece creator
    function GamePiece(x, y, color, width, height, speed, img) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.height = height
        this.speed = speed
        this.alive = true
        this.img = img
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
        }
    }

    // Random X and Y coordinate generators to spawn garbage and each rat randomly
    const generateX = (num) => {
        return Math.floor(Math.random() * Math.floor(num))
    }
    
    const generateY = (num) => {
        return Math.floor(Math.random() * Math.floor(num))
    }

    let randomX = generateX(game.width - 200)
    let randomY = generateY(game.height - 40)
    let randomY1 = generateY(game.height - 30)
    let randomY2 = generateY(game.height - 30)
    let randomY3 = generateY(game.height - 30)
    

    // Game Pieces to be created
    let garbageBoy = new GamePiece(740, 163, 'green', 60, 75, 10, gbImg)
    let garbageCan = new GamePiece(10, 175, 'grey', 40, 50, 0, garbageImg)
    let garbage = new GamePiece(randomX, randomY, 'yellow', 20, 20, 0, bottleImg)
    let rat1 = new GamePiece(200, randomY1, 'brown', 30, 30, 3, ratImg)
    let rat2 = new GamePiece(400, randomY2, 'brown', 30, 30, 3, ratImg)
    let rat3 = new GamePiece(600, randomY3, 'brown', 30, 30, 5, ratImg)

    rat3.moveUp = true
    rat3.moveDown = false

    /*----- Event Listeners & Functions -----*/
    startBtn.addEventListener('click', e => {
        e.preventDefault()
        startBtn.style.display = 'none'
        intro.style.display = 'none'
        main.style.display = 'inline-block'
        stageText.style.display = 'inline-block'
        stageText.textContent = 'Take Garbage Boy home!'
        healthText.style.display = 'inline-block'
        healthText.textContent = 'Health: ❤️'
        gameTick()
    })

    retryBtn.addEventListener('click', e => {
        e.preventDefault()
        retryBtn.style.display = 'none'
        resetGame()
    })

    // What the game does each frame
    const gameTick = () => {
        ctx.clearRect(0, 0, game.width, game.height)
        if (garbageBoy.alive && garbageCan.alive) {
            garbageCanCollision()
            garbageCollision()
            rat1Collision()
            rat2Collision()
            rat3Collision()
        } else {
            endStage()
        }
        if (garbage.alive) {
            garbage.render()
        }
        garbageBoy.render()
        garbageCan.render()
        rat1.render()
        rat2.render()
        rat3.render()
        moveRat3()
    }

    // If GB makes it home!
    const garbageCanCollision = () => {
        if (garbageBoy.x < garbageCan.x + garbageCan.width
            && garbageBoy.y < garbageCan.y + garbageCan.height
            && garbageBoy.y + garbageBoy.height > garbageCan.y
            && !garbage.alive) {
                garbageCan.alive = false
                stageText.textContent = 'Welcome home, Garbage Boy!'
                retryBtn.style.display = 'inline-block'
            } else if (garbageBoy.x < garbageCan.x + garbageCan.width
                && garbageBoy.y < garbageCan.y + garbageCan.height
                && garbageBoy.y + garbageBoy.height > garbageCan.y
                && garbage.alive) {
                    stageText.textContent = 'GB is too depressed to go home.'
                }
    }

    // When GB picks up a piece of garbage
    const garbageCollision = () => {
        if (garbageBoy.x + garbageBoy.width > garbage.x
            && garbageBoy.x < garbage.x + garbage.width
            && garbageBoy.y < garbage.y + garbage.height
            && garbageBoy.y + garbageBoy.height > garbage.y) {
                garbage.alive = false
                stageText.textContent = 'Nice find! That is some rad garbage, my dude.'
            } 
    }

    // If GB runs into one of those nasty rats!
    const rat1Collision = () => {
        if (garbageBoy.x + garbageBoy.width > rat1.x
            && garbageBoy.x < rat1.x + rat1.width
            && garbageBoy.y < rat1.y + rat1.height
            && garbageBoy.y + garbageBoy.height > rat1.y) {
                garbageBoy.alive = false
                stageText.textContent = 'Ew! A rat!'
                healthText.textContent = 'Health: 💔'
                retryBtn.style.display = 'inline-block'
            }
    }

    const rat2Collision = () => {
        if (garbageBoy.x + garbageBoy.width > rat2.x
            && garbageBoy.x < rat2.x + rat2.width
            && garbageBoy.y < rat2.y + rat2.height
            && garbageBoy.y + garbageBoy.height > rat2.y) {
                garbageBoy.alive = false
                stageText.textContent = 'Ew! A rat!'
                healthText.textContent = 'Health: 💔'
                retryBtn.style.display = 'inline-block'
            }
    }

    const rat3Collision = () => {
        if (garbageBoy.x + garbageBoy.width > rat3.x
            && garbageBoy.x < rat3.x + rat3.width
            && garbageBoy.y < rat3.y + rat3.height
            && garbageBoy.y + garbageBoy.height > rat3.y) {
                garbageBoy.alive = false
                stageText.textContent = 'Ew! A rat!'
                healthText.textContent = 'Health: 💔'
                retryBtn.style.display = 'inline-block'
            }
    }

    // Game interval
    let gameLoop = setInterval(gameTick, 60)

    const endStage = () => {
        clearInterval(gameLoop)
    }

    // Restore game to initial state
    const resetGame = () => {
        ctx.clearRect(0, 0, game.width, game.height)
        stageText.textContent = 'Take Garbage Boy home!'
        healthText.textContent = 'Health: ❤️'
    }

    /*----- Movement Mechanics -----*/
    // WASD Control of GB
    const moveGarbageBoy = (e) => {
        switch(e.key) {
            case 'w':
                if (garbageBoy.y > 0) {
                    garbageBoy.y -= garbageBoy.speed;
                }
                break;
            case 'd':
                if (garbageBoy.x + garbageBoy.width < game.width) {
                    garbageBoy.x += garbageBoy.speed;
                }
                break;
            case 's':
                if (garbageBoy.y + garbageBoy.height < game.height) {
                    garbageBoy.y += garbageBoy.speed;
                }
                break;
            case 'a':
                if (garbageBoy.x > 0) {
                    garbageBoy.x -= garbageBoy.speed;
                }
                break;
        }
    }
    document.addEventListener('keydown', moveGarbageBoy)

    //Move rat, move!
    const moveRat3 = () => {
        if (rat3.moveUp && rat3.y > 0) {
            rat3.y -= rat3.speed
        } else if (rat3.moveDown && rat3.y < game.height) {
            rat3.y += rat3.speed
        } else if (rat3.moveUp && rat3.y <= 0) {
            rat3.y++
            rat3.moveUp = false
            rat3.moveDown = true
        } else if (rat3.moveDown && rat3.y >= game.height - rat3.height - 1) {
            rat3.moveUp = true
            rat3.moveDown = false
            rat3.y = game.height - rat3.height
        }
    }
})
