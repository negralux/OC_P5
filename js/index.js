/*AFFICHAGE CONTENU DU HEADER */
        var contenuHeader = fonctionAffichageHeader();
        document.getElementById("header").innerHTML = contenuHeader;
/*FIN*/

/*MESSAGE ACTION*/

        affichageMessageAction(); // Message de confimation d'une action
/*FIN*/
         
    /*Nettoyage du div si non vide*/
        document.getElementById("resultats").innerHTML = "";

    /*On peut changer de catalogue "manuellement"*/
        var catalogue = "cameras"; // Opions de catalogue : cameras, teddies, furniture


    /*Récupération du contenu du catalogue (promise)*/
        connect("http://localhost:3000/api/"+catalogue)
            .then(function(response){
                var objets = response;// si ok dans la promise
                var Resultats = document.getElementById("resultats"); //affichage dans id > resultats

                    for (var i = 0; i < objets.length; i++) {
                        var objet = objets[i];


                        var article =
                        '<article class="containerArticle">'+
                            '<a href="produit.html?catalogue=' + catalogue + '&produit=' + objet._id + '">'+
                                '<div class="elementContainerArticle"><img src="' + objet.imageUrl + '" ></div>'+
                                    '<div class="elementContainerArticle">'+
                                        '<div class="contentDescriptionArticle">'+
                                            '<h2>' + objet.name + '</h2>'+
                                            '<div class="textDescription">' + objet.description + '</div>'+
                                        '</div>'+
                                    '</div>'+
                            '</a>'+
                        '</article>';

                        //Affichage des articles du catalogue
                        Resultats.innerHTML += article;
                    }
            })
            .catch(function(error){
                console.log(error) //Erreur si echec
            })

/*SWITCH TITRE DE LA PAGE EN FONCTION DE var catalogue= line 15  */
        var contenuH1 = "";
        switch (catalogue) {
            case "teddies":
                contenuH1 = "PELUCHES";
                break;
            case "cameras":
                contenuH1 = "APPAREILS PHOTO DE COLLECTION";
                break;
            case "furniture":
                contenuH1 = "MEUBLES EN BOIS";
                break;
        }
        document.getElementById("baliseH1").innerHTML = contenuH1;
/*FIN*/