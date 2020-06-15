/*AFFICHAGE CONTENU DU HEADER */
        var contenuHeader = fonctionAffichageHeader();
        document.getElementById("header").innerHTML = contenuHeader;
/*FIN*/

/*MESSAGE PANIER*/

        affichageMessageAction(); // Message de confimation d'une action

/*CONFIRMATION ET RETOUR CATALOGUE*/
        if (localStorage.confirmCommande !== "KO") {
            document.getElementById("resultats").innerHTML =
                '<div class="messageConfirmationCommande">'+
                    '<p>Confirmation de votre commande n° ' + localStorage.confirmCommande + '</p>'+
                    '<p>A bientôt</p>'+
                    '<p><a href="index.html"><i class="fas fa-camera-retro"></i></a></p>'+
                '</div>';
        } else {
            document.getElementById("resultats").innerHTML =
                '<div class="messageConfirmationCommande">'+
                    '<p>Désolé mais nous rencontrons un problème. Veuillez réssayer dans quelques instants</p>'+
                    '<p>Retour au catalogue...</p>'+
                    '<p><a href="index.html"><i class="fas fa-camera-retro"></i></a></p>'+
                '</div>';
        }
/*FIN*/