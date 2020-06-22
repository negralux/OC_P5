 /*AFFICHE  LE CONTENU DU HEADER */
        var contenuHeader = fonctionAffichageHeader();
        document.getElementById("header").innerHTML = contenuHeader;
/*FIN*/

/*MESSAGE PANIER*/

        affichageMessageAction(); //Message de confimation d'une action


        /* Constantes pour constituer la page html*/
        const urlComplete = window.location.href; //recupere l'url
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString); //recupere data après ? de l'url
        const catalogue = urlParams.get('catalogue'); //recupere catalogue
        const idProduit = urlParams.get('produit'); // recupere produit

        /*SWITCH pour déterminer les options "colors, lenses, varnish*/   
        let propertyOne = "";
        switch (catalogue) {
            case "teddies":
                propertyOne = "colors";
                break;
            case "cameras":
                propertyOne = "lenses";
                break;
            case "furniture":
                propertyOne = "varnish";
                break;
        }
        /*VÉRIFICATION DE L'EXISTENCE DES VARIABLES*/
        /*requette XML vers le backend pour la page index.html */

        /* RÉCUPÉRATION DU CATALOGUE en fonction de l'id (promise)*/
        connect("http://localhost:3000/api/"+catalogue+"/"+idProduit)
            .then(function(response){
                let reponse = response; // resultat si promise OK
            
                var options = reponse[propertyOne]; // propertyOne transmet sa valeur a options

                var selectOptions = "";
                for (let x in options) {
                    selectOptions += '<option value="' + options[x] + '">' + options[x] + '</option>';
                }
                /*MODIFICATION DES QUANTITÉS POSSIBLES*/
                var selectOptionsQuantite = "";
                for (y = 1; y < 6; y++) {
                    selectOptionsQuantite += '<option value="' + y + '">' + y + '</option>';
                }

                /*creation du bloc article à insérer dans produit.html liste déroulante quantité:65 / options:66  + submit line 75*/

                let article = 
                    '<article class="containerArticlePageProduit">'+
                        '<div class="elementContainerArticle">'+
                            '<img src="' + reponse.imageUrl + '" >'+
                        '</div>'+
                        '<div class="elementContainerArticle">'+
                            '<div class="contentDescriptionArticle">'+
                                '<h2>' + reponse.name + '</h2>'+
                                '<div class="textDescription">' + reponse.description + '</div>'+
                                '<div class="divPrix">Prix: ' + transformPrice(reponse.price) + '</div>'+
                                '<div id="selectOptionProduit">'+
                                        '<form onsubmit="return fonctionSubmitProduit()" id="FormProduit">'+
                                            '<label>Quantité: </label><label><select name="quantite" id="quantite">' + selectOptionsQuantite + '</select></label>'+
                                            '<label> Option: </label><label><select name="option" id="option">' + selectOptions + '</select></label>'+
                                            '<input type="hidden" name="id" id="id" value="' + idProduit + '">'+
                                            '<input type="hidden" name="urlRetour" id="urlRetour" value="' + urlComplete + '">'+
                                            '<input type="hidden" name="name" id="name" value="' + reponse.name + '">'+
                                            '<input type="hidden" name="description" id="description" value="' + reponse.description + '">'+
                                            '<input type="hidden" name="prix" id="prix" value="' + reponse.price + '">'+
                                            '<input type="hidden" name="urlImage" id="urlImage" value="' + reponse.imageUrl + '">'+
                                            '<input type="hidden" name="catalogue" id="catalogue" value="' + catalogue + '">'+
                                            
                                            '<input type="submit" value="Ajouter au panier" class="boutonSubmitProduit"/>'+
                                        '</form>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</article>';


                 /*AFFICHAGE DES DÉTAILS DE L'ARTICLE*/
                let Resultats = document.getElementById("resultats"); //affichage dans id > resultats
                Resultats.innerHTML = article;
            })
            .catch(function(error){
                console.log(error)
            })