 
    function main(){
        var users = []; 
        const userInput = document.querySelector("#player-username");    
        const startGameDiv = document.querySelector(".start-game"); 
        const playerScore = document.querySelector(".player-score"); 
        const gameArea = document.querySelector(".game-area"); 
        const gameOver = document.querySelector(".game-over"); 
        const toolbar = document.querySelector(".toolbar");
        const buttons = toolbar.querySelector(".buttons");
        const firstHeart = document.querySelector(".firstLife"); 
        const secondHeart = document.querySelector(".secondLife"); 
        const coinsCountEl = document.querySelector("#coinsCount");
        const deadPlayerScreen = document.querySelector(".dead-player"); 
        const payHeartButton = document.querySelector("#payAHeart"); 
        payHeartButton.addEventListener("click", payHeart); 
        const bestScoreEl = document.querySelector("#bestScore");
        const allPlayers = document.querySelector("#players"); 
        const replayButton = document.querySelector(".replay"); 
        const continueButton = document.querySelector(".continue"); 
        const payedAHeart = document.querySelector(".payedAHeart");
        const pausedGameScreen = document.querySelector(".paused");

        let hasPayedAHeart = false;
        let isPaused = false; 
       
        let startButton = document.querySelector("#start"); 
        startButton.addEventListener("click", startGame); 

        let keys = {}; 
        let player = {
            x: 150, 
            y: 100,
            width: 0, 
            height: 0, 
            lastFiredFireball: 0, 
        }; 
        let game = {
            speed: 2, 
            movingMultiplier: 4, 
            fireballMultiplier: 5, 
            fireInterval: 1000, 
            planetSpawnInterval: 5000,
            alienSpawnInterval: 1000,
            coinSpawnInterval: 6000,
        }; 
        let scene = {
            score: 0, 
            coins: 0, 
            lastPlanetSpawn: 0, 
            lastAlienSpawn: 0, 
            isActiveGame: true, 
            lastCoinSpawn: 0, 
        }

      
        let currentIndex; 

        function startGame(event){
            event.preventDefault(); 

            users.push({
                username: userInput.value || "Anonymous",
                points: 0, 
            }); 
            userInput.value = "";

            document.addEventListener("keydown", function onKeyDown(e){
                e.preventDefault(); 
                keys[e.code] = true;  
            });
            document.addEventListener("keyup",  function onKeyUp(e){
                e.preventDefault(); 
                keys[e.code] = false;  
            }) 

         
            userInput.value = ""; 

             startGameDiv.classList.add("hide"); 
             gameArea.classList.remove("hide"); 
             toolbar.classList.remove("hide");

             //render toolbar buttons
             const pauseButton = document.createElement("button");
             pauseButton.classList.add("pause-button"); 
             pauseButton.addEventListener("click", pauseGame); 
             const quitButton = document.createElement("button"); 
             quitButton.classList.add("quit-button");
             quitButton.addEventListener("click", quitHandler); 
             const whiteSpace = document.createElement("div");
             whiteSpace.classList.add("whiteSpace");
             buttons.append(pauseButton, whiteSpace, quitButton); 

             //render avatar
             const avatar = document.createElement("div");
             avatar.classList.add("avatar"); 
             avatar.style.top = "200px"; 
             avatar.style.left = "200px";
             gameArea.append(avatar);
             player.width = avatar.offsetWidth;
             player.height = avatar.offsetHeight; 

             //render planets

             window.requestAnimationFrame(gameAction); 
        }

            function gameAction(timestamp){
                const avatar = document.querySelector(".avatar"); 
                let {speed, movingMultiplier, fireballMultiplier} = game; 
                let movingValue = speed * movingMultiplier; 

                let fireballs = document.querySelectorAll(".fireball"); 
                fireballs.forEach(fireball => {
                    fireball.x += speed * fireballMultiplier; 
                    fireball.style.left = fireball.x + "px";
                    if(fireball.x + fireball.offsetWidth > gameArea.offsetWidth){
                        fireball.remove();
                    }
                })

                let planets = document.querySelectorAll(".planet"); 
                planets.forEach(planet => {
                    planet.x -= speed; 
                    planet.style.left = planet.x + "px"; 
                    if(planet.x  <= 0){
                        planet.remove(); 
                    }
                })

                let aliens = document.querySelectorAll(".alien"); 
                aliens.forEach(alien => {
                    alien.x -= speed * 3; 
                    alien.style.left = alien.x + "px"; 
                    if(alien.x <= 0 || alien.style.top > gameArea.offsetHeight){
                        alien.remove();
                    }
                })

                let coins = document.querySelectorAll(".coin"); 
                coins.forEach(coin => {
                    coin.x -= speed * 5;
                    coin.style.left = coin.x + "px"; 
                    if(coin.x <= 0){
                        coin.remove(); 
                    }
                })

                //Collision detection 
                for(let alien of aliens){
                    if(isCollision(avatar, alien)){
                        alien.remove();
                        reducePlayersHearts();
                        if(checkIfDead()){
                            endGame(); 
                            window.cancelAnimationFrame(gameAction)
                            break; 
                        }
                    }

                    fireballs.forEach(fireball => {
                        if(isCollision(fireball, alien)){
                            scene.score += 200;
                            playerScore.textContent = `${scene.score}pts.`;  
                            alien.remove();
                            fireball.remove(); 
                        }
                    })

                    coins.forEach(coin => {
                        if(isCollision(avatar, coin)){
                            scene.coins++; 
                            coinsCountEl.textContent = scene.coins; 
                            coin.remove(); 
                        }
                    })
                }

                if(keys.ArrowUp && player.y > 0){
                    player.y -= movingValue; 
                }
                if(keys.ArrowDown && player.y + player.height < gameArea.offsetHeight){
                    player.y += movingValue; 
                }
                if(keys.ArrowLeft && player.x > 0){
                    player.x -= movingValue;
                }
                if(keys.ArrowRight && player.x + player.width < gameArea.offsetWidth){
                    player.x += movingValue;
                }
                if(keys.Space && timestamp - player.lastFiredFireball > game.fireInterval){
                    avatar.classList.add("fire"); 
                    addFireBall();
                    player.lastFiredFireball = timestamp; 
                } else{
                    avatar.classList.remove("fire")
                }
                if(timestamp - scene.lastPlanetSpawn > game.planetSpawnInterval + 2000 * Math.random()){
                let planet = document.createElement("div"); 
                const allPlanets = ["url('./images/red-planet.png')", 
                                    "url('./images/saturn.png')", 
                                    "url('./images/venus.png')", 
                                    "url('./images/planet.png')", 
                                    "url('./images/moon.png')", 
                                    "url('./images/mars.png')", 
                                    "url('./images/jupiter.png')",
                                ]               
                let randomIndex = Math.floor(Math.random() * (8 - 0)) + 0;
                if(currentIndex === randomIndex){
                    randomIndex= randomIndex + 1 || randomIndex - 1;
                }
                currentIndex = randomIndex; 

                planet.classList.add("planet"); 
                planet.style.backgroundImage = allPlanets[randomIndex]; 
                planet.x = gameArea.offsetWidth - 200; 
                planet.style.left = planet.x + "px";
                planet.style.top = (gameArea.offsetHeight - 200) * Math.random() + "px";
                gameArea.append(planet); 
                scene.lastPlanetSpawn = timestamp; 
                }
                if(timestamp - scene.lastAlienSpawn > game.alienSpawnInterval + 5000 * Math.random()){
                    let alien = document.createElement("div"); 
                    alien.classList.add("alien"); 
                    alien.x = gameArea.offsetWidth - 60;
                    alien.style.left = alien.x + "px"; 
                    alien.style.top = (gameArea.offsetHeight - 60) * Math.random() + "px"; 
                    gameArea.append(alien); 
                    scene.lastAlienSpawn = timestamp; 
                }
                if(timestamp - scene.lastCoinSpawn > game.coinSpawnInterval + 2000 * Math.random()){
                    let coin = document.createElement("div"); 
                    coin.classList.add("coin"); 
                    coin.x = gameArea.offsetWidth - 60;
                    coin.style.left = coin.x + "px"; 
                    coin.style.top = (gameArea.offsetHeight - 60) * Math.random() + "px"; 
                    gameArea.append(coin); 
                    scene.lastCoinSpawn = timestamp; 
                }
                if(scene.isActiveGame){
                    window.requestAnimationFrame(gameAction); 
                }

                avatar.style.top = `${player.y}px`;
                avatar.style.left = `${player.x}px`; 
            }
           
                function addFireBall(){
                    let fireball = document.createElement("div"); 
                    fireball.classList.add("fireball"); 
                    fireball.style.top = (player.y + player.height / 3 - 5) + "px"; 
                    fireball.x = player.x + player.width;
                    fireball.style.left = fireball.x + "px"; 
                    gameArea.append(fireball); 
                }
            
                function isCollision(firstElement, secondElement){
                    let firstRect = firstElement.getBoundingClientRect(); 
                    let secondRect = secondElement.getBoundingClientRect(); 
                    return !(firstRect.top > secondRect.bottom ||
                            firstRect.bottom < secondRect.top ||
                            firstRect.right < secondRect.left ||
                            firstRect.left > secondRect.right); 
                }

                    function checkIfDead(){ 
                        let fHeartClasses = Array.from(firstHeart.classList); 
                        let sHeartClasses = Array.from(secondHeart.classList);
                        if(fHeartClasses.includes("dead") && sHeartClasses.includes("dead")){
                            return true
                        } else{
                             return false 
                            }
                    }

                    function reducePlayersHearts(){
                        let fHeartClasses = Array.from(firstHeart.classList); 
                        let sHeartClasses = Array.from(secondHeart.classList);
                        if(fHeartClasses.includes("dead")){
                            secondHeart.classList.remove("alive");
                            secondHeart.classList.add("dead"); 
                        } else if(sHeartClasses.includes("dead") && fHeartClasses.includes("dead")){
                            return; 
                        } else{
                            firstHeart.classList.remove("alive");
                            firstHeart.classList.add("dead"); 
                        }
                    }

                    function endGame(){
                        gameArea.classList.add("hide"); 
                        if(!hasPayedAHeart){
                            deadPlayerScreen.classList.remove("hide"); 
                        } else{
                            gameOver.classList.remove("hide"); 
                            showGameOverInfo();  
                        }
                       
                        scene.isActiveGame = false;   
                    }

                        function payHeart(e){   
                            e.preventDefault(); 
                            let playersCoins = Number(coinsCountEl.textContent);
                            if(playersCoins >= 200){ 
                                deadPlayerScreen.classList.add("hide");
                                payedAHeart.classList.remove("hide"); 
                                firstHeart.classList.remove("dead"); 
                                firstHeart.classList.add("alive"); 
                                continueButton.addEventListener("click", continueGame); 
                                playersCoins -= 2; 
                                coinsCountEl.textContent = playersCoins; 
                                scene.coins -= 2; 
                            } else{
                                deadPlayerScreen.remove()
                                gameOver.classList.remove("hide"); 
                                showGameOverInfo();                 
                            }
                        }

                            function replayHandler(e){
                                e.preventDefault(); 
                                gameOver.classList.add("hide"); 
                                startGameDiv.classList.remove("hide"); 
                                location.reload()
                            }

                                function continueGame(e){
                                    e.preventDefault(); 
                                    payedAHeart.classList.add("hide"); 
                                    deadPlayerScreen.remove();  
                                    hasPayedAHeart = true; 
                                    gameArea.classList.remove("hide"); 
                                    scene.isActiveGame = true; 
                                    window.requestAnimationFrame(gameAction); 
                                }

                                    function showGameOverInfo(){
                                        let currentUser = users[users.length - 1]; 
                                        currentUser.points = scene.score; 
                                        let sortedUsers = users.sort((a, b) => b.points - a.points);
                                        let bestUser = sortedUsers[0]; 
                                        bestScoreEl.textContent += bestUser.points + "pts."; 
                                        for(let user of users){
                                            let current = document.createElement("span"); 
                                            current.textContent = `${user.username}: ${user.points}`;
                                            allPlayers.append(current); 
                                        }
        
                                        replayButton.addEventListener("click", replayHandler); 
                                    }

                                        function pauseGame(e){
                                            e.preventDefault(); 
                                            if(isPaused){
                                                pausedGameScreen.classList.add("hide");  
                                                scene.isActiveGame = true; 
                                                window.requestAnimationFrame(gameAction); 
                                                isPaused = false; 
                                            } else{
                                                pausedGameScreen.classList.remove("hide"); 
                                                scene.isActiveGame = false; 
                                                isPaused = true; 
                                            }     
                                        }

                                            function quitHandler(e){
                                                e.preventDefault();
                                               if(window.confirm("Are you sure you want to quit the game?")){
                                                    scene.isActiveGame = false; 
                                                    gameArea.classList.add("hide"); 
                                                    location.reload()
                                               } 
                                            }
    }