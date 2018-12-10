const Jeu = {
    joueurCourant: 0, // 0 veux dire qu'il n'y a aucun joueur
    cases: [[], [], []],

    scores: {
        1: 0,
        2: 0,
    },

    lock: false,

    commencer: function() {
        Jeu.elirePremierJoueur();

        $(document).ready(function() {
            $(".case").children().text("");
        });

        $("[id^=case]").on('click', function() {
            if ($(this).children().text() !== "") {
                Jeu.verifierVictoire();
                return ;
            }

            // Je met le texte de la case en fonction du joueur
            $(this).children().text(function () {
                if (Jeu.lock)
                    return;
                return Jeu.joueurCourant  === 1 ? "X" : "O";
            });

            Jeu.verifierVictoire();
            Jeu.verifierEgalitee();
            Jeu.changerJoueur();
            Jeu.updateText();
        });

        Jeu.lock = false;
        Jeu.updateText();
    },

    elirePremierJoueur() {
        Jeu.joueurCourant = Math.floor(Math.random() * (3 - 1) + 1);
    },

    changerJoueur() {
        Jeu.joueurCourant = Jeu.joueurCourant === 1 ? 2 : 1;
    },

    updateText() {
        if (Jeu.lock)
            return;
        $("#text-jeu").text("C'est au tour du Joueur " + Jeu.joueurCourant);
    },

    chargerLesCases() {
        // Cette methode marche mais elle est longue
        // Jeu.cases[1][1] = $("#case-1");
        // Jeu.cases[1][1] = $("#case-2");

        for (let lignes = 0; lignes <= 2; lignes++) {
            for (let colonnes = 0; colonnes <= 2; colonnes++) {
                const element = $("#case-"+( (3 * lignes ) + colonnes));
                Jeu.cases[lignes][colonnes] = element;
                $(this).removeClass("error");
            }
        }
    },

    verifierVictoire() {
        Jeu.chargerLesCases();
        // On verifie d'abord les lignes
        for (x = 0; x <= 2; x++){
            Jeu.verifierElement(Jeu.cases[x][0], Jeu.cases[x][1], Jeu.cases[x][2]);
        }

        // Puis les colones
        for (y = 0; y <= 2; y++) {
            Jeu.verifierElement(Jeu.cases[0][y], Jeu.cases[1][y], Jeu.cases[2][y]);
        }

        // Et enfin les diagonales
        Jeu.verifierElement(Jeu.cases[0][0], Jeu.cases[1][1], Jeu.cases[2][2]);
        Jeu.verifierElement(Jeu.cases[2][0], Jeu.cases[1][1], Jeu.cases[0][2]);
    },


    verifierElement(premiereCase, deuxiemeCase, troisiemeCase) {
        let getText = function (node) {
            return node.children().text();
        };

        if (getText(premiereCase) === "" || getText(deuxiemeCase) === "" || getText(troisiemeCase) === "")
            return ;

        if (getText(premiereCase) === getText(deuxiemeCase) && getText(premiereCase) === getText(troisiemeCase))
            Jeu.declarerVictoire(premiereCase, deuxiemeCase, troisiemeCase);
    },

    declarerVictoire(premiereCase, deuxiemeCase, troisiemeCase) {
        if (Jeu.lock)
            return;
        Jeu.lock = true;

        let joueur = premiereCase.children().text() === "X" ? 1 : 2;
        Jeu.scores[joueur]++;
        Jeu.updateScore();

        $("#text-jeu").text("Le joueur " + joueur + " gagne !");

        let add = function() {
            premiereCase.addClass("win");
            deuxiemeCase.addClass("win");
            troisiemeCase.addClass("win");
        };

        let remove = function() {
            premiereCase.removeClass("win");
            deuxiemeCase.removeClass("win");
            troisiemeCase.removeClass("win");
        };

        for (let base = 0; base < 10; base = base + 2) {
            setTimeout(add, base * 500);
            setTimeout(remove, (base + 1) * 500);
        }


        setTimeout(Jeu.commencer, 5000);
    },

    verifierEgalitee() {
        // Cette methode marche mais elle est longue
        // Jeu.cases[1][1] = $("#case-1");
        // Jeu.cases[1][1] = $("#case-2");

        for (let lignes = 0; lignes <= 2; lignes++) {
            for (let colonnes = 0; colonnes <= 2; colonnes++) {
                if (Jeu.cases[lignes][colonnes].children().text() !== "X"
                    && Jeu.cases[lignes][colonnes].children().text() !== "O") {
                    return ;
                }
            }
        }
        Jeu.declarerEgalitee();
    },

    declarerEgalitee() {
        if (Jeu.lock)
            return;
        Jeu.lock = true;
        $("#text-jeu").text("Egalitee !");

        setTimeout(Jeu.commencer, 5000);
    },

    updateScore() {
        $("#score-joueur1").text(this.scores["1"]);
        $("#score-joueur2").text(this.scores["2"]);
    }
};
