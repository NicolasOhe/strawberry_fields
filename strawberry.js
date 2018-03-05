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
    var taille = 18;
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
        y: 100,
        ttbroughtfood: 2

    }
    var baseReds = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        ttbroughtfood: 2
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
        nbOfLig = Math.floor(canvas.height / fieldsize);


    function effectuerChangements() {
        compteurInterval();
        newBestioleFromGatheredRessources();
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
        context.fillText(baseBlues.ttbroughtfood, baseBlues.x - 15, baseBlues.y + 15);



        context.fillStyle = "red";
        context.beginPath();
        context.arc(baseReds.x, baseReds.y, 50, 10, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText(baseReds.ttbroughtfood, baseReds.x - 15, baseReds.y + 15);
    }

    var souris = {
        x: 0,
        y: 0
    };
    document.getElementById("mon_canvas").addEventListener("mousemove", function (e) {
        souris.x = e.clientX;
        souris.y = e.clientY;
        context.arc(souris.x, souris.y, 20, 10, 0, 2 * Math.PI);

        /*var currentCol = Math.floor(souris.x / fieldsize);
        var currentLign = Math.floor(souris.y / fieldsize);

        fieldContainer[currentLign][currentCol].vitality = 200; */



    });
    document.getElementById("mon_canvas").addEventListener("click", function (e) {
        souris.x = e.clientX;
        souris.y = e.clientY;
        //createNewBestiole(souris.x, souris.y, "green");

        var currentCol = Math.floor(souris.x / fieldsize);
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
            this.vie = Math.random() * 0.5 + 0.2;
            //}

            this.mission = "searchfood";

            this.deplacementX = (4 * Math.random() - 2);
            this.deplacementY = (4 * Math.random() - 2);

        },

        animate: function (i) {

            this.xPos = this.xPos + this.deplacementX;
            this.yPos = this.yPos + this.deplacementY;

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




            // si la bestiole touche une autre
            for (var y = 0; y < tableauPersos.length - 1; y++) {
                if (Math.abs(this.yPos - tableauPersos[y].yPos) < this.taille + tableauPersos[y].taille && Math.abs(this.xPos - tableauPersos[y].xPos) < this.taille + tableauPersos[y].taille) {


                    if (this.team !== tableauPersos[y].team) {
                        this.vie -= 0.01;
                    } else {
                        if (this.team == "blue") {
                            if (this.mission == "gohome" && tableauPersos[y].vie > 0.4 && this.vie > tableauPersos[y].vie && this.vie < 0.95) {
                                this.vie += 0.01;
                                tableauPersos[y].vie -= 0.01;

                            }
                        } else if (this.team == "red") {
                            if (this.mission == "gohome" && tableauPersos[y].vie > 0.4 && this.vie > tableauPersos[y].vie && this.vie < 0.95) {
                                this.vie += 0.01;
                                tableauPersos[y].vie -= 0.01;

                            }
                        }

                    }
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

            if (this.vie > 0.95) this.mission = "gohome";



            var attractionX = 0,
                attractionY = 0;
            if (this.vie > 0.6 && this.mission == "gohome") { // si plein : rentrer à la base
                if (this.team == "red") {
                    attractionX = (baseReds.x - this.xPos) / canvas.width;
                    attractionY = (baseReds.y - this.yPos) / canvas.height;
                    this.deplacementX += attractionX;
                    this.deplacementY += attractionY;
                } else if (this.team == "blue") {
                    attractionX = (baseBlues.x - this.xPos) / canvas.width;
                    attractionY = (baseBlues.y - this.yPos) / canvas.height;
                    this.deplacementX += attractionX;
                    this.deplacementY += attractionY;
                }

            } else { // sinon: rechercher ressources
                this.mission = "searchfood";
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

                    //var differentielhautbas = ttbas - tthaut;
                    //var differentielgauchedroite = ttdroite - ttgauche;


                    attractionX = ttdroite - ttgauche;
                    attractionY = ttbas - tthaut;
                    this.deplacementX += attractionX / 100;
                    this.deplacementY += attractionY / 100;


                }
            }

            if (this.deplacementX > 1) this.deplacementX = 1;
            if (this.deplacementY > 1) this.deplacementY = 1;
            if (this.deplacementX < -1) this.deplacementX = -1;
            if (this.deplacementY < -1) this.deplacementY = -1;





            this.vie = this.vie * 0.998 - 0.001 //viellissement
            //this.vie = this.vie - 0.003; //viellissement


            // deliver food
            if (this.mission == "gohome") {


                if (this.team == "red") {
                    var broughtfood;
                    if (Math.abs(baseReds.x - this.xPos) < 20 && Math.abs(baseReds.y - this.yPos) < 20) {
                        broughtfood = this.vie - 0.5;
                        baseReds.ttbroughtfood += broughtfood;
                        this.vie = 0.5;
                        this.mission = "searchfood";
                    }
                } else if (this.team == "blue") {
                    if (Math.abs(baseBlues.x - this.xPos) < 20 && Math.abs(baseBlues.y - this.yPos) < 20) {
                        broughtfood = this.vie - 0.5;
                        baseBlues.ttbroughtfood += broughtfood;
                        this.vie = 0.5;
                        this.mission = "searchfood";
                    }
                }
            }


            if (this.vie < 0) { //mort de la bestiole
                tableauPersos.splice(i, 1);
                i++;
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

            if (this.mission == "gohome") {
                context.fillStyle = 'rgb(255, 255, 255)';
                context.beginPath();
                context.arc(this.xPos, this.yPos, 5, 0, 2 * Math.PI);
                context.fill();
                context.closePath();
            }


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

    var BluesInterval = 40000;
    var compteurIntervalBlues = 0;
    var RedsInterval = 40000;
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
    
    function newBestioleFromGatheredRessources() {
        
        if (baseBlues.ttbroughtfood >= 1) {
            baseBlues.ttbroughtfood -= 1;
            createNewBestiole(baseBlues.x, baseBlues.y, "blue");
        }
        if (baseReds.ttbroughtfood >= 1) {
            baseReds.ttbroughtfood -= 1;
            createNewBestiole(baseReds.x, baseReds.y, "red");
        }
    }








    createfield(fieldsize);

    function createfield(fieldsize) {
        for (var i = 0; i <= nbOfLig; i++) {
            lineOfFields = [];
            for (var y = 0; y <= nbOfCol; y++) {
                newField = Object.create(Field);
                newField.init(y * fieldsize, i * fieldsize, Math.random() * 10);
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
                fieldContainer[i][y].vitality += 0.01;
                context.fillStyle = 'rgb(0, ' + currentValue + ', 0)';
                context.fillRect(y * fieldsize, i * fieldsize, fieldsize, fieldsize);
            }
        }

    }


    


}
