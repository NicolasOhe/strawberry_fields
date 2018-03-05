window.onload = function () {

    var canvas = document.getElementById('mon_canvas');
    if (!canvas) {
        alert("Impossible de récupérer le canvas");
        return;
    }

    var context = canvas.getContext('2d');
    if (!context) {
        alert("Impossible de récupérer le context du canvas");
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var hasard = 0;
    var nombreBestioles = 2;
    var taille = 19;
    var valMinBestioles = nombreBestioles / 3;
    var valMaxBestioles = nombreBestioles * 3;
    var transformationPredateur = 30;
    var tailleGrossesse = 40;
    var avantageVitesse = 0.1;
    var vitesseDeroulement = 2;
    var visionPredateurs = 90;
    var visionProies = 60;
    var baseBlues = {
        x: canvas.width / 2,
        y: 100

    }
    var baseReds = {
        x: canvas.width / 2,
        y: canvas.height - 100

    }

    var Field = {
        init: function (xPos, yPos, vitality) {
            this.x = xPos;
            this.y = yPos;
            this.vitality = vitality;
        },
        update: function () {

        }
    }

    var fieldContainer = [],
        lineOfFields = [],
        fieldsize = 20,
        nbOfCol = Math.floor(canvas.width / fieldsize),
        nbOfLig = Math.floor(canvas.height / fieldsize) - 1;


    function effectuerChangements() {
        compteurInterval();
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height); // réinitialiser  canvas. 

        showfield();
        var numberOfReds = 0;
        var numberOfBlues = 0;
        for (var i = 0; i < tableauPersos.length - 1; i++) {
            tableauPersos[i].animate(i);
            if (tableauPersos[i].team == "red") {
                numberOfReds++;
            } else if (tableauPersos[i].team == "blue") {
                numberOfBlues++;
            }


        }


        context.fillStyle = "green";
        context.beginPath();
        context.arc(souris.x, souris.y, 20, 10, 0, 2 * Math.PI);
        context.fill();
        context.closePath();

        context.fillStyle = "blue";
        context.beginPath();
        context.arc(baseBlues.x, baseBlues.y, 50, 10, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText(numberOfBlues, baseBlues.x - 15, baseBlues.y + 15);



        context.fillStyle = "red";
        context.beginPath();
        context.arc(baseReds.x, baseReds.y, 50, 10, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText(numberOfReds, baseReds.x - 15, baseReds.y + 15);
    }

    var souris = {
        x: 0,
        y: 0
    };
    document.getElementById("mon_canvas").addEventListener("mousemove", function (e) {
        souris.x = e.clientX;
        souris.y = e.clientY;
        context.arc(souris.x, souris.y,20, 10, 0, 2 * Math.PI);
        
        var currentCol = Math.floor(souris.x/ fieldsize);
        var currentLign = Math.floor(souris.y / fieldsize);

        fieldContainer[currentLign][currentCol].vitality = 200;
        
        
        
    });
    document.getElementById("mon_canvas").addEventListener("click", function (e) {
        souris.x = e.clientX;
        souris.y = e.clientY;
        //createNewBestiole(souris.x, souris.y, "green");

        var currentCol = Math.floor(souris.x/ fieldsize);
        var currentLign = Math.floor(souris.y / fieldsize);

        fieldContainer[currentLign][currentCol].vitality = 200;

    });



    var Bestiole = {
        init: function (x, y, team) {
            /*if (grosseur) {
                this.taille = grosseur;
            } else { */
            this.taille = taille;
            //}

            if (x) {
                this.xPos = x;
            } else {
                this.xPos = taille + Math.round((canvas.width - (taille * 2)) * Math.random());
            }

            if (y) {
                this.yPos = y;
            } else {
                this.yPos = taille + Math.round((canvas.height - (taille * 2)) * Math.random());
            }
            if (team) {
                this.team = team;
            } else {
                this.team = team;
            }

            /*if (vie) {
                this.vie = vie;
            } else { */
            this.vie = Math.random();
            //}

            this.deplacementX = (4 * Math.random() - 2);
            this.deplacementY = (4 * Math.random() - 2);

        },

        animate: function (i) {
            this.xPos = this.xPos + this.deplacementX;
            this.yPos = this.yPos + this.deplacementY;




            // si la bestiole touche une autre
            for (var y = 0; y < tableauPersos.length - 1; y++) {
                if (Math.abs(this.yPos - tableauPersos[y].yPos) < this.taille + tableauPersos[y].taille && Math.abs(this.xPos - tableauPersos[y].xPos) < this.taille + tableauPersos[y].taille && this.team !== tableauPersos[y].team) {
                    this.vie -= 0.01;
                }
            }
            // la bestiole prend une partie de l'égergie de la case sous laquelle elle se trouve
            var currentCol = Math.floor(this.xPos / fieldsize);
            var currentLign = Math.floor(this.yPos / fieldsize);
            var vitalityOfField = Math.round(fieldContainer[currentLign][currentCol].vitality);
            if (vitalityOfField > 0 && this.vie < 0.99) {
                //if (vitalityOfField > 0 ) {
                this.vie += 0.01;
                fieldContainer[currentLign][currentCol].vitality -= 1
            }
            // la bestiole regarde ce qu'il y a sur les cases d'à coté
            //en haut
            if (currentCol > 1 && currentLign > 1 && currentCol + 1 < nbOfCol && currentLign + 1 < nbOfLig) {
                var tthaut = (fieldContainer[currentLign - 1][currentCol - 1].vitality + fieldContainer[currentLign - 1][currentCol].vitality + fieldContainer[currentLign - 1][currentCol + 1].vitality);
                //en bas
                var ttbas = fieldContainer[currentLign + 1][currentCol - 1].vitality + fieldContainer[currentLign + 1][currentCol].vitality + fieldContainer[currentLign + 1][currentCol + 1].vitality;
                //à gauche
                var ttgauche = fieldContainer[currentLign + 1][currentCol - 1].vitality + fieldContainer[currentLign][currentCol - 1].vitality + fieldContainer[currentLign - 1][currentCol - 1].vitality;
                // à droite
                var ttdroite = fieldContainer[currentLign + 1][currentCol + 1].vitality + fieldContainer[currentLign][currentCol + 1].vitality + fieldContainer[currentLign - 1][currentCol + 1].vitality;

                var differentielhautbas = ttbas - tthaut;
                var differentielgauchedroite = ttdroite - ttgauche;


                var attractionX = ttdroite - ttgauche;
                var attractionY = ttbas - tthaut;
                this.deplacementX += attractionX / 100;
                this.deplacementY += attractionY / 100;
                if (this.deplacementX > 1) this.deplacementX = 1;
                if (this.deplacementY > 1) this.deplacementY = 1;
                if (this.deplacementX < -1) this.deplacementX = -1;
                if (this.deplacementY < -1) this.deplacementY = -1;

            }




            //comportement si la bestiole touche une bordure
            if (this.xPos + this.taille >= canvas.width) {
                this.deplacementX = -this.deplacementX;
            } else if (this.xPos - this.taille <= 0) {
                this.deplacementX = -this.deplacementX;
            }
            if (this.yPos + this.taille >= canvas.height) {
                this.deplacementY = -this.deplacementY;
            } else if (this.yPos - this.taille <= 0) {
                this.deplacementY = -this.deplacementY;
            }

            this.vie = this.vie * 0.995 - 0.003 //viellissement




            if (this.vie < 0) { //mort de la bestiole
                tableauPersos.splice(i, 1);

            }




            //On a tout ce qu'il nous faut pour tracer notre carré :
            //context.fillStyle = 'rgb(255, ' + this.vie + ', 255)';
            if (this.team == "red") {
                context.fillStyle = 'rgba(255, 0, 0,' + this.vie + ')';
            } else if (this.team == "blue") {
                context.fillStyle = 'rgba(0, 0, 255,' + this.vie + ')';
            } else {
                context.fillStyle = 'rgba(0, 255, 0,' + this.vie + ')';
            }

            //context.fillRect(this.xPos, this.yPos, this.taille, this.taille);


            context.beginPath();
            context.arc(this.xPos, this.yPos, this.taille, 0, 2 * Math.PI);
            context.fill();
            context.closePath();

        }
    };



    //on crée et place les bestioles sur le canvas
    var tableauPersos = [];
    for (var i = 0; i < nombreBestioles; i++) {
        createNewBestiole();
    }

    function createNewBestiole(x, y, grosseur) {
        var newbestiole = Object.create(Bestiole);
        newbestiole.init(x, y, grosseur);
        tableauPersos.push(newbestiole);
    }

    var myInterval = setInterval(effectuerChangements, 1000 / (30 * vitesseDeroulement)); //Notre boucle de rafraîchissement.

    var BluesInterval = 4000;
    var compteurIntervalBlues = 0;
    var RedsInterval = 4000;
    var compteurIntervalReds = 0;

    function compteurInterval() {
        compteurIntervalBlues += 30 * vitesseDeroulement;
        compteurIntervalReds += 30 * vitesseDeroulement;
        if (compteurIntervalBlues >= BluesInterval) {
            compteurIntervalBlues = 0;
            createNewBestiole(baseBlues.x, baseBlues.y, "blue");
        }
        if (compteurIntervalReds >= RedsInterval) {
            compteurIntervalReds = 0;
            createNewBestiole(baseReds.x, baseReds.y, "red");
        }
    }







    createfield(fieldsize);

    function createfield(fieldsize) {
        for (var i = 0; i <= nbOfLig; i++) {
            lineOfFields = [];
            for (var y = 0; y <= nbOfCol; y++) {
                newField = Object.create(Field);
                newField.init(y * fieldsize, i * fieldsize, Math.random() * 100);
                lineOfFields.push(newField);
            }
            fieldContainer.push(lineOfFields);
        }

    }
    //showfield();
    function showfield() {
        var currentValue, currentField;
        for (var i = 0; i <= nbOfLig; i++) {
            for (var y = 0; y <= nbOfCol; y++) {
                currentField = fieldContainer[i][y];
                currentValue = Math.round(fieldContainer[i][y].vitality);
                fieldContainer[i][y].vitality += Math.random() / 50;
                context.fillStyle = 'rgb(0, ' + currentValue + ', 0)';
                context.fillRect(y * fieldsize, i * fieldsize, fieldsize, fieldsize);
            }
        }

    }


    function controlePopulation() {
        for (var i = 0; i < tableauPersos.length; i++) { // on controle si il y a des bestioles de taille 0, que l'on retire du tableau le cas échéant
            var tailleBestAct = tableauPersos[i].taille;
            if (tailleBestAct < 1) {
                tableauPersos.splice(i, 1);
                i--;
            }
        }
        if (tableauPersos.length < valMinBestioles) { // si le nombre de bestiole diminue trop
            var Rescousse = Object.create(Bestiole);
            Rescousse.init();
            tableauPersos.push(Rescousse);
        }
        if (tableauPersos.length > valMaxBestioles) { // si le nombre de bestiole augmente trop
            tableauPersos.splice(0, 1);

        }
    }


}
