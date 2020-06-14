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
    themeSong.volume = .5
    let garbageUp = document.createElement('audio')
    garbageUp.src = 'sounds/garbage-up.mp3'
    garbageUp.volume = .5
    let stageSound = document.createElement('audio')
    stageSound.src = 'sounds/stage-end.mp3'
    stageSound.volume = .5
    let ratSound = document.createElement('audio')
    ratSound.src = 'sounds/rat-hit.mp3'
    ratSound.volume = .5

    /*----- Create sprites -----*/
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
    let benImg = new Image()
    benImg.src = 'img/ben.png'
    let coneImg = new Image()
    coneImg.src = 'img/cone.png'


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
    function Rat(x, y, width, height, speedX, speedY, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speedX = speedX
        this.speedY = speedY
        this.img = img
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
        }
        this.collision = function() {
            if (garbageBoy.x + garbageBoy.width > this.x
                && garbageBoy.x < this.x + this.width
                && garbageBoy.y < this.y + this.height
                && garbageBoy.y + garbageBoy.height > this.y) {
                    endStage()
                    themeSong.pause()
                    garbageBoy.alive = false
                    ratSound.play()
                    healthText.textContent = 'Health: 0'
                    retryBtn.style.display = 'inline-block'
                    ctx.font = '150px VT323'
                    ctx.fillStyle = '#C6CA53'
                    ctx.textAlign = 'center';
                    ctx.fillText('Ew! A rat!', game.width/2, game.height/2)
                }
        }
        this.move = function() {
            if (this.x <= 0 || this.x >= game.width - this.width) {
                this.speedX = -this.speedX
            }
            if (this.y <= 0 || this.y >= game.height - this.height) {
                this.speedY = -this.speedY
            }
            if (this.x + this.width > trafficCone.x
                && this.x < trafficCone.x + trafficCone.width
                && this.y < trafficCone.y + trafficCone.height
                && this.y + this.height > trafficCone.y) {
                    this.speedX = -this.speedX
                    this.speedY = -this.speedY
                }
            this.x -= this.speedX
            this.y -= this.speedY
        }
    }

    // Ben constructor
    function Ben(x, y, width, height, speed, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.img = img
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
        }
        this.collision = function() {
            if (garbageBoy.x + garbageBoy.width > this.x
                && garbageBoy.x < this.x + this.width
                && garbageBoy.y < this.y + this.height
                && garbageBoy.y + garbageBoy.height > this.y) {
                    endStage()
                    themeSong.pause()
                    garbageBoy.alive = false
                    ratSound.play()
                    healthText.textContent = 'Health: 0'
                    retryBtn.style.display = 'inline-block'
                    ctx.font = '125px VT323'
                    ctx.fillStyle = '#C6CA53'
                    ctx.textAlign = 'center';
                    ctx.fillText('Big Ben! *gasp*', game.width/2, game.height/2)
                }
        }
        this.move = function() {
            if (garbageBoy.x > this.x) {
                this.x += this.speed
            } else if (garbageBoy.x < this.x) {
                this.x -= this.speed
            }
            if (garbageBoy.y > this.y) {
                this.y += this.speed
            } else if (garbageBoy.y < this.y) {
                this.y -= this.speed
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

    // Barrier constructor
    function Barrier(x, y, width, height, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.img = img
        this.render = function() {
            ctx.drawImage(this.img, this.x, this.y)
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

    // Random Garbage Position
    let randomX = generateX(100, 720)
    let randomY = generateY(0, 360)

    //Random Rat 1
    let randomX1 = generateX(100, 650)
    let randomY1 = generateY(0, 370)

    // Random Rat 2
    let randomX2 = generateX(100, 650)
    let randomY2 = generateY(0, 370)

    // Random Rat 3
    let randomX3 = generateX(100, 650)
    let randomY3 = generateY(0, 370)

    // Traffic Cone
    let randomXCone = generateX(100, 650)
    let randomYCone = generateY(0, 370)

    // Randomly spawn piece of garbage
    const randomNum = () => {
        return Math.floor(Math.random() * 2)
    }

    let randomGarbo = randomNum()

    const benSpawnChance = () => {
        return Math.random()
    }

    let benSpawn = benSpawnChance()

    // Stage number
    let stageNum = 1

    // Game asset creation
    let garbageBoy = new GamePiece(740, 163, 35, 68, 10, gbImg)
    let garbageCan = new GamePiece(10, 175, 40, 50, 0, garbageImg)
    let garbage = new PieceOfGarbage(randomX, randomY, 20, 20, bottleImg)
    let garbage1 = new PieceOfGarbage(randomX, randomY, 20, 20, chocoImg)
    let bigBen = new Ben(60, 175, 30, 23, 1, benImg)
    let trafficCone = new Barrier(randomXCone, randomYCone, 29, 36, coneImg)

    // Rat array
    let rats = []

    //Push rats to array
    rats.push(new Rat(randomX1, randomY1, 30, 23, 5, 5, ratImg))
    rats.push(new Rat(randomX2, randomY2, 30, 23, 6, 6, ratImg))
    rats.push(new Rat(randomX3, randomY3, 30, 23, 7, 7, ratImg))

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
            rats.forEach((rat) => {
                if (rat.speedX > 0) {
                    rat.speedX -= stageNum + 2
                    if (rat.speedX <= 0) {
                        rat.speedX = 0
                    }
                } else if (rat.speedX < 0) {
                    rat.speedX += stageNum + 2
                    if (rat.speedX >= 0) {
                        rat.speedX = 0
                    }
                }

                if (rat.speedY > 0) {
                    rat.speedY -= stageNum + 2
                    if (rat.speedY <= 0) {
                        rat.speedY = 0
                    }
                } else if (rat.speedY < 0) {
                    rat.speedY += stageNum + 2
                    if (rat.speedY >= 0) {
                        rat.speedY = 0
                    }
                }
            })
            bigBen.speed = 0
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
            for (let i = 0; i < rats.length; i++) {
                rats[i].collision()
            }
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
        for (let i = 0; i < rats.length; i++) {
            rats[i].render()
            rats[i].move()
        }
        if (benSpawn <= .20) {
            bigBen.render()
            bigBen.move()
            bigBen.collision()
        }
        trafficCone.render()
    }

    // If GB makes it home!
    const garbageCanCollision = () => {
        if (garbageBoy.x < garbageCan.x + garbageCan.width
            && garbageBoy.y < garbageCan.y + garbageCan.height
            && garbageBoy.y + garbageBoy.height > garbageCan.y
            && (!garbage.alive || !garbage1.alive)) {
                themeSong.pause()
                endStage()
                garbageCan.alive = false
                stageSound.play()
                ctx.font = '115px VT323'
                ctx.fillStyle = '#C6CA53'
                ctx.textAlign = 'center';
                ctx.fillText('Welcome home, GB!', game.width/2, game.height/2)
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
        //set Big Ben at original position
        bigBen.x = 60
        bigBen.y = 175
        //create new rat positions
        for (let i = 0; i < rats.length; i++) {
            rats[i].x = generateX(100, 720)
            rats[i].y = generateY(0, 370)
        }
        //reset garbage at same point
        if (!garbage.alive) {
            garbage.alive = true
        } else if (!garbage1.alive) {
            garbage1.alive = true
        }
        //reset any garbage effects
        for (let i = 0; i < rats.length; i++) {
            rats[i].speedX = 5 + i + stageNum
            rats[i].speedY = 5 + i + stageNum
        }
        garbageBoy.speed = 10
        bigBen.speed = 2
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
            for (let i = 0; i < rats.length; i++) {
                rats[i].speedX = 5 + i + stageNum
                rats[i].speedY = 5 + i + stageNum
            }
            garbageBoy.speed = 10
            bigBen.speed = 2
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
        //create new rat positions
        for (let i = 0; i < rats.length; i++) {
            rats[i].x = generateX(100, 720)
            rats[i].y = generateY(0, 370)
        }
        //increase rat movement speed
        for (let i = 0; i < rats.length; i++) {
            rats[i].speedX += 1
            rats[i].speedY += 1
        }
        //reset Big Ben spawn
        benSpawn = benSpawnChance()
        bigBen.x = 60
        bigBen.y = 175
        //increase stage number
        stageNum++
        //update stage display
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
                if (garbageBoy.x + garbageBoy.width > trafficCone.x
                    && garbageBoy.x < trafficCone.x + trafficCone.width
                    && garbageBoy.y < trafficCone.y + trafficCone.height
                    && garbageBoy.y + garbageBoy.height > trafficCone.y) {
                        garbageBoy.y = trafficCone.y + trafficCone.height
                    }
                break;
            case 'd':
                if (garbageBoy.x + garbageBoy.width < game.width) {
                    garbageBoy.x += garbageBoy.speed;
                    if (garbageBoy.x + garbageBoy.width > game.width) {
                        garbageBoy.x = game.width - garbageBoy.width
                    }
                }
                if (garbageBoy.x + garbageBoy.width > trafficCone.x
                    && garbageBoy.x < trafficCone.x + trafficCone.width
                    && garbageBoy.y < trafficCone.y + trafficCone.height
                    && garbageBoy.y + garbageBoy.height > trafficCone.y) {
                        garbageBoy.x = trafficCone.x - garbageBoy.width
                    }
                break;
            case 's':
                if (garbageBoy.y + garbageBoy.height < game.height) {
                    garbageBoy.y += garbageBoy.speed;
                    if (garbageBoy.y + garbageBoy.height > game.height) {
                        garbageBoy.y = game.height - garbageBoy.height
                    }
                }
                if (garbageBoy.x + garbageBoy.width > trafficCone.x
                    && garbageBoy.x < trafficCone.x + trafficCone.width
                    && garbageBoy.y < trafficCone.y + trafficCone.height
                    && garbageBoy.y + garbageBoy.height > trafficCone.y) {
                        garbageBoy.y = trafficCone.y - garbageBoy.height
                    }
                break;
            case 'a':
                if (garbageBoy.x > 0) {
                    garbageBoy.x -= garbageBoy.speed;
                    if (garbageBoy.x < 0) {
                        garbageBoy.x = 0
                    }
                }
                if (garbageBoy.x + garbageBoy.width > trafficCone.x
                    && garbageBoy.x < trafficCone.x + trafficCone.width
                    && garbageBoy.y < trafficCone.y + trafficCone.height
                    && garbageBoy.y + garbageBoy.height > trafficCone.y) {
                        garbageBoy.x = trafficCone.x + trafficCone.width
                    }
                break;
        }
    }
    document.addEventListener('keydown', moveGarbageBoy)

})