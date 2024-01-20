  // Code JavaScript pour implémenter les divers fonctionnalités
        // du Jeu et de l’interface utilisateur.
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");

        let interval = null;

        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 3;
        let dy = -3;
        let ballRadius = 10;
        let colorRandom = "#F50EB6";

        // Hauteur et Largeur de la palette, puis positionnement initilal de cette
        // palette dans le Canvas
        let paddleHeight = 10;
        let paddleWidth = 100;
        let paddleX = (canvas.width - paddleWidth) / 2;

        // Gestion du déplacement de la palette - Clavier
        let rightPressed = false;
        let leftPressed = false;

        let brickRowCount = 5; // 5 Briques par ligne
        let brickColumnCount = 3; // 3 Briques par colonne
        let brickWidth = 75; // Largeur d'une Brique
        let brickHeight = 20; // Hauteur d'une Brique
        let brickPadding = 10; // Ecart entre les Briques
        let brickOffsetTop = 30; // Décalage superieur
        let brickOffsetLeft = 30; // Décalage à gauche

        let score = 0; // Initialisation du score à 0
        let lives = 3; // Nombre de vies au départ
        // Récupération dans le Local Storage de la couleur de fond du Canvas 
        let recupColorBackLS = localStorage.colorSetting;
        // Récupération dans le Local Storage de la couleur des éléments d'interface
        let recupColorElementsLS = localStorage.colorElements;

        //document.getElementById("imagePinguin").hide;
        // Permet de récupérer la couleur contenue dans la letiable localStorage.colorSetting
        document.getElementById("myCanvas").style.backgroundColor = recupColorBackLS;
        document.getElementById("couleurback").value = recupColorBackLS;

        let maCollectionElements = document.getElementsByClassName("colorElement");
        for (i = 0; i < maCollectionElements.length; i++) {
            document.getElementsByClassName('colorElement')[i].style.color = recupColorElementsLS;
        }
        document.getElementById("couleurtitre").value = recupColorElementsLS;

        let bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1
                };
            }
        }

        // Permet de changer la couleur du Titre et des libellés hors Canvas de l'Interface
        let recupElement = document.getElementById("couleurtitre");
        recupElement.addEventListener("change", colorElement, false);

        function colorElement(event) {
            let maCollectionElements = document.getElementsByClassName("colorElement");
            for (i = 0; i < maCollectionElements.length; i++) {
                document.getElementsByClassName('colorElement')[i].style.color = event.target.value;
            }
            localStorage.colorElements = event.target.value;
            document.location.reload();
            //createCookie("colTitre",event.target.value,10);   
        }

        // Permet de changer la couleur de fond du Canvas.
        let recupBack = document.getElementById("couleurback");
        recupBack.addEventListener("change", selectColorPicker, false);

        function selectColorPicker(event) {
            document.getElementById("myCanvas").style.backgroundColor = event.target.value;
            localStorage.colorSetting = event.target.value;
            document.location.reload();
        }

        // Méthode qui permet d'obtenir une couleur aléatoire au format hexadecimal
        // de la forme #XXXXXX
        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        // Dessin dans le Canvas de la balle
        function drawBall(paramColor) {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            //ctx.fillStyle = getRandomColor();
            //ctx.fillStyle = "#F50EB6";
            ctx.fillStyle = paramColor;
            ctx.fill();
            ctx.closePath();
        }
        // Dessin dans le Canvas de la "raquette"
        function drawPaddle(paramColor) {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = paramColor;
            ctx.fill();
            ctx.closePath();
        }

        // Dessin sur le Canevas des Briques en tenant compte des différents paramétres
        function drawBricks(paramColor) {
            // Récupération de l'image insérée dans le DOM
            let img = document.getElementById("imageBrique");
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status == 1) {
                        let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                        let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;

                        // Afin d'utiliser une image en guise de Brique ;-)
                        //ctx.beginPath();
                        //ctx.drawImage(img, brickX, brickY, 80, 80);
                        //ctx.closePath();

                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = paramColor;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function drawScore(paramColor) {
            ctx.font = "16px Arial";
            ctx.fillStyle = paramColor;
            ctx.fillText("Score: " + score, 8, 20);
        }

        function drawLives(paramColor) {
            ctx.font = "16px Arial";
            ctx.fillStyle = paramColor;
            ctx.fillText("Vies: " + lives, canvas.width - 65, 20);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks(recupColorElementsLS);
            drawBall(recupColorElementsLS);
            drawPaddle(recupColorElementsLS);
            drawScore(recupColorElementsLS);
            drawLives(recupColorElementsLS);
            collisionDetection();

            x += dx;
            y += dy;

            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
                // Méthode JavaScript pour générer une couleur aléatoire de la balle à chaque
                // collision.
                //colorRandom = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                //ctx.fillStyle = getRandomColor();

            }
            //if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
            //dy = -dy;
            //colorRandom = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            //ctx.fillStyle = getRandomColor();
            //}
            if (y + dy < ballRadius) {
                dy = -dy;
            } else if (y + dy > canvas.height - ballRadius) {

                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    lives--;
                    if (!lives) {
                        alert("GAME OVER");
                        document.location.reload();

                        // clearInterval(interval); // Needed for Chrome to end game
                        // ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // ctx.fillStyle = '#F50EB6';
                        // ctx.font = '50px sans-serif';
                        // ctx.fillText('Game Over', ((canvas.width / 2) - (ctx.measureText('Game Over').width / 2)), 100);

                    } else {
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 4;
                        dy = -4;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 8;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 8;
            }

            requestAnimationFrame(draw);
        } // Fin de la fonction draw()

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        function keyDownHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }

        function mouseMoveHandler(e) {
            let relativeX = e.clientX - canvas.offsetLeft;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        }

        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    let b = bricks[c][r];
                    if (b.status == 1) {
                        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if (score == brickRowCount * brickColumnCount) {

                                // clearInterval(interval);
                                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                                // ctx.fillStyle = '#F50EB6';
                                // ctx.font = '30px sans-serif';
                                // ctx.fillText('Félicitations, vous avez gagné !', ((canvas.width / 2) - (ctx.measureText('Félicitations, vous avez gagné !').width / 2)), 100);

                                alert("Félicitations, vous avez gagné !");
                                document.location.reload();

                            }
                        }
                    }
                }
            }
        }

        //let recupMonBouton = document.getElementById("monbouton");
        //recupMonBouton.addEventListener("click", ExecuteDraw, false);

        function ExecuteDraw() {
            //interval = setInterval(draw, 10);
            //console.log(interval);
        }
        document.getElementById("monbouton").onclick = draw;
