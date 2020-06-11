document.addEventListener('DOMContentLoaded', () => {

    /*----- DOM Refs -----*/
    let startBtn = document.getElementById('start-btn')
    let intro = document.getElementById('intro')
    let main = document.getElementById('main')
    let stageText = document.getElementById('stage')
    let messageText = document.getElementById('message')
    let inventoryText = document.getElementById('inventory')
    let inventoryImg = document.getElementById('inventory-img')
    let healthText = document.getElementById('health')
    let game = document.getElementById('game')
    let retryBtn = document.getElementById('retry-btn')
    let stageBtn = document.getElementById('stage-btn')
    let muteBtn = document.getElementById('mute')
    let unMuteBtn = document.getElementById('unmute')
    let currentInv = new Image()
    game.width = 800
    game.height = 400
    let ctx = game.getContext('2d')

    /*----- Sounds -----*/
    let themeSong = document.createElement('audio')
    themeSong.src = 'sounds/gb-theme.mp3'
    let garbageUp = document.createElement('audio')
    garbageUp.src = 'sounds/garbage-up.mp3'
    let stageSound = document.createElement('audio')
    stageSound.src = 'sounds/stage-end.mp3'
    let ratSound = document.createElement('audio')
    ratSound.src = 'sounds/rat-hit.mp3'

    /*----- Create character sprites -----*/
    let garbageImg = new Image()
    garbageImg.src = 'img/garbage.png'
    let gbImg = new Image()
    gbImg.src = 'img/garbageboy2.png'
    let bottleImg = new Image()
    bottleImg.src = 'img/bottle.png'
    let chocoImg = new Image()
    chocoImg.src = 'img/choco-bar.png'
    let ratImg = new Image()
    ratImg.src = 'img/rat.png'


    /*----- Variable Declarations -----*/
    // Garbage Boy / Garbage Boy constructor
    function GamePiece(x, y, width, height, speed, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.alive = true
        this.img = img
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
        }
    }

    // Rat constructor
    function Rat(x, y, width, height, speed, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.moveUp = true
        this.moveDown = false
        this.img = img
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
        }
        this.collision = function() {
            if (garbageBoy.x + garbageBoy.width > this.x
                && garbageBoy.x < this.x + this.width
                && garbageBoy.y < this.y + this.height
                && garbageBoy.y + garbageBoy.height > this.y) {
                    garbageBoy.alive = false
                    ratSound.play()
                    themeSong.pause()
                    messageText.textContent = 'Ew! A rat!'
                    healthText.textContent = 'Health: 0'
                    retryBtn.style.display = 'inline-block'
                }
        }
        this.move = function() {
            if (this.moveUp && this.y > 0) {
                this.y -= this.speed
            } else if (this.moveDown && this.y < game.height - this.height) {
                this.y += this.speed
            } else if (this.moveUp && this.y <= 0) {
                this.y++
                this.moveUp = false
                this.moveDown = true
            } else if (this.moveDown && this.y >= game.height - this.height) {
                this.moveUp = true
                this.moveDown = false
                this.y = game.height - this.height
            }
        }
    }

    // Garbage constructor
    function PieceOfGarbage(x, y, width, height, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.alive = true
        this.img = img
        this.used = false
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
        }
        this.collision = function() {
            if (garbageBoy.x + garbageBoy.width > this.x
                && garbageBoy.x < this.x + this.width
                && garbageBoy.y < this.y + this.height
                && garbageBoy.y + garbageBoy.height > this.y
                && this.alive) {
                    this.alive = false
                    garbageUp.play()
                    messageText.textContent = 'Rad garbage my dude!'
                    currentInv.src = this.img.src
                    inventoryImg.appendChild(currentInv)
                }
        }
    }

    // Random X and Y coordinate generators to spawn garbage and each rat randomly
    const generateX = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
    }
    
    const generateY = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
    }

    let randomX = generateX(100, 720)
    let randomY = generateY(0, 360)
    let randomY1 = generateY(0, 370)
    let randomY2 = generateY(0, 370)
    let randomY3 = generateY(0, 370)

    // Randomly spawn piece of garbage
    const randomNum = () => {
        return Math.floor(Math.random() * 2)
    }

    let randomGarbo = randomNum()

    // Stage number
    let stageNum = 1

    // Game asset creation
    let garbageBoy = new GamePiece(740, 163, 35, 68, 10, gbImg)
    let garbageCan = new GamePiece(10, 175, 40, 50, 0, garbageImg)
    let garbage = new PieceOfGarbage(randomX, randomY, 20, 20, bottleImg)
    let garbage1 = new PieceOfGarbage(randomX, randomY, 20, 20, chocoImg)
    let rat1 = new Rat(200, randomY1, 30, 30, 7, ratImg)
    let rat2 = new Rat(400, randomY2, 30, 30, 6, ratImg)
    let rat3 = new Rat(600, randomY3, 30, 30, 5, ratImg)

    // Game interval
    let gameLoop = null

    /*----- Event Listeners -----*/

    // Start button
    startBtn.addEventListener('click', e => {
        e.preventDefault()
        startBtn.style.display = 'none'
        intro.style.display = 'none'
        main.style.display = 'inline-block'
        stageText.textContent = `Stage: ${stageNum}`
        messageText.textContent = 'Take Garbage Boy home!'
        inventoryText.textContent = 'Inventory: '
        healthText.textContent = 'Health: 1'
        themeSong.play()
        themeSong.loop = true
        muteBtn.style.display = 'inline-block'
        unMuteBtn.style.display = 'inline-block'
        gameLoop = setInterval(gameTick, 60)
        gameTick()
    })

    // Retry button
    retryBtn.addEventListener('click', e => {
        e.preventDefault()
        retryBtn.style.display = 'none'
        themeSong.play()
        resetStage()
    })

    // Next stage button
    stageBtn.addEventListener('click', e => {
        e.preventDefault()
        stageBtn.style.display = 'none'
        themeSong.play()
        advanceStage()
    })

    // Clicking on inventory item
    inventoryImg.addEventListener('click', e => {
        e.preventDefault()
        if (e.target.src.includes('img/bottle.png')) {
            rat1.speed -= stageNum + 1
            rat2. speed -= stageNum + 1
            rat3.speed -= stageNum + 1
            if (rat1.speed <= 0) {
                rat1.speed = 0
            }
            if (rat2.speed <= 0) {
                rat2.speed = 0
            }
            if (rat3.speed <= 0) {
                rat3.speed = 0
            }
            garbage.used = true
        } else if (e.target.src.includes('img/choco-bar.png')) {
            garbageBoy.speed += 40
            garbage1.used = true
        }
        inventoryImg.removeChild(currentInv)
    })

    //mute and unmute buttons (i cannot keep listening to this song)
    muteBtn.addEventListener('click', e => {
        e.preventDefault()
        themeSong.muted = true
        garbageUp.muted = true
        stageSound.muted = true
        ratSound.muted = true
    })

    unMuteBtn.addEventListener('click', e => {
        e.preventDefault()
        themeSong.muted = false
        garbageUp.muted = false
        stageSound.muted = false
        ratSound.muted = false
    })

    /*----- Functions -----*/

    // What the game does each frame
    const gameTick = () => {
        ctx.clearRect(0, 0, game.width, game.height)
        if (garbageBoy.alive && garbageCan.alive) {
            garbageCanCollision()
            rat1.collision()
            rat2.collision()
            rat3.collision()
        } else {
            themeSong.pause()
            endStage()
        }
        if (garbage.alive && randomGarbo === 0) {
             garbage.render()
             garbage.collision()
        } else if (garbage1.alive && randomGarbo === 1) {
            garbage1.render()
            garbage1.collision()
        }
        if (garbageCan.alive) {
            garbageBoy.render()
        }
        garbageCan.render()
        rat1.render()
        rat2.render()
        rat3.render()
        rat1.move()
        rat2.move()
        rat3.move()
    }

    // If GB makes it home!
    const garbageCanCollision = () => {
        if (garbageBoy.x < garbageCan.x + garbageCan.width
            && garbageBoy.y < garbageCan.y + garbageCan.height
            && garbageBoy.y + garbageBoy.height > garbageCan.y
            && (!garbage.alive || !garbage1.alive)) {
                garbageCan.alive = false
                stageSound.play()
                messageText.textContent = 'Welcome home, Garbage Boy!'
                stageBtn.style.display = 'inline-block'
            } else if (garbageBoy.x < garbageCan.x + garbageCan.width
                && garbageBoy.y < garbageCan.y + garbageCan.height
                && garbageBoy.y + garbageBoy.height > garbageCan.y
                && (garbage.alive || garbage1.alive)) {
                    messageText.textContent = 'GB is too sad to go home.'
                }
    }

    // Interval clear
    const endStage = () => {
        clearInterval(gameLoop)
    }

    // Retry current stage
    const resetStage = () => {
        //clear board
        ctx.clearRect(0, 0, game.width, game.height)
        //update display
        retryBtn.style.display = 'none'
        messageText.textContent = 'Take Garbage Boy home!'
        healthText.textContent = 'Health: 1'
        //reset alive-ness & position
        garbageBoy.alive = true
        garbageCan.alive = true
        garbage.alive = true
        //set GB at original position
        garbageBoy.x = 740
        garbageBoy.y = 163
        //reset garbage at same point
        if (!garbage.alive) {
            garbage.alive = true
        } else if (!garbage1.alive) {
            garbage1.alive = true
        }
        //reset any garbage effects
        rat1.speed = 7 + stageNum
        rat2. speed = 6 + stageNum
        rat3.speed = 5 + stageNum
        garbageBoy.speed = 10
        //clear inventory if holding anything
        if (inventoryImg.hasChildNodes()) {
            inventoryImg.removeChild(currentInv)
        }
        //start your engines
        gameLoop = setInterval(gameTick, 60)
        gameTick()
    }

    // Advance stage
    const advanceStage = () => {
        //clear canvas
        ctx.clearRect(0, 0, game.width, game.height)
        //reset displays
        stageBtn.style.display = 'none'
        messageText.textContent = 'Take Garbage Boy home!'
        //reset alive-ness
        garbageBoy.alive = true
        garbageCan.alive = true
        garbage.alive = true
        //set GB at original position
        garbageBoy.x = 740
        garbageBoy.y = 163
        //remove any garbage effects
        if (garbage.used || garbage1.used) {
            rat1.speed = 7 + stageNum
            rat2. speed = 6 + stageNum
            rat3.speed = 5 + stageNum
            garbageBoy.speed = 10
        }
        //create new garbage spawn integer
        randomGarbo = randomNum()
        //reset garbage to alive and place new garbo
        if (randomGarbo === 0) {
            garbage.alive = true
            garbage.x = generateX(100, 720)
            garbage.y = generateY(0, 360)
        } else if (randomGarbo === 1) {
            garbage1.alive = true
            garbage1.x = generateX(100, 720)
            garbage1.y = generateY(0, 360)
        }
        //increase stage
        stageNum++
        //increase rat movement speed
        rat1.speed += 2
        rat2.speed += 2
        rat3.speed += 2
        //update stage number
        stageText.innerText = `Stage: ${stageNum}`
        //start your engines
        gameLoop = setInterval(gameTick, 60)
        gameTick()
    }

    /*----- GB Movement -----*/
    const moveGarbageBoy = (e) => {
        switch(e.key) {
            case 'w':
                if (garbageBoy.y > 0) {
                    garbageBoy.y -= garbageBoy.speed;
                    if (garbageBoy.y < 0) {
                        garbageBoy.y = 1
                    }
                }
                break;
            case 'd':
                if (garbageBoy.x + garbageBoy.width < game.width) {
                    garbageBoy.x += garbageBoy.speed;
                    if (garbageBoy.x + garbageBoy.width > game.width) {
                        garbageBoy.x = game.width - garbageBoy.width
                    }
                }
                break;
            case 's':
                if (garbageBoy.y + garbageBoy.height < game.height) {
                    garbageBoy.y += garbageBoy.speed;
                    if (garbageBoy.y + garbageBoy.height > game.height) {
                        garbageBoy.y = game.height - garbageBoy.height
                    }
                }
                break;
            case 'a':
                if (garbageBoy.x > 0) {
                    garbageBoy.x -= garbageBoy.speed;
                    if (garbageBoy.x < 0) {
                        garbageBoy.x = 0
                    }
                }
                break;
        }
    }
    document.addEventListener('keydown', moveGarbageBoy)

})