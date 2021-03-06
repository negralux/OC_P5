/*INITIALISATION ARRIVÉE DU VISITEUR*/
if (localStorage.getItem("panier") === null) {
    localStorage.setItem("panier", "vide");
    localStorage.setItem("messagePanier", "vide");
}

/*FIN*/

/*FONCTION CALCUL DU NOMBRE D'ARTICLES TOTAL DANS LE PANIER*/
function functionCalculArticlesDuPanier (panier) {
    var paniers = JSON.parse(localStorage.getItem("panier")); //Recupere le panier en local 
    var quantite = 0;
    for (let x in paniers) {
        quantite += parseInt(paniers[x].quantite);
    }

    return quantite;
}
/*FIN*/

/*FONCTION CALCUL PRIX TOTAL DU PANIER*/
function functionCalculPrixTotalDuPanier (panier) {
    var paniers = JSON.parse(localStorage.getItem("panier")); //Recupere le panier en local 
    var tableauDeComptageDesPrix = [];
    for (let x in paniers) {
        var lignePanier = paniers[x];
        tableauDeComptageDesPrix.push(lignePanier.prixAjour);
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const prixTotalDuPanier = tableauDeComptageDesPrix.reduce(reducer);

    return prixTotalDuPanier;
}
/*FIN*/

/*AFFICHAGE DU MENU HEADER DES PAGES DU SITE*/
function fonctionAffichageHeader (panier) {
    let contenuHeader = null;
    if (localStorage.getItem("panier") === "vide") { // panier vide
        contenuHeader = '<button class="bouton"><a href="index.html">Notre catalogue</a></button><button class="bouton"><a href="panier.html" title="0.00€">Panier (0 article)</a></button>';
    } else {
        const totalDesArticlesDuPanier = functionCalculArticlesDuPanier(); // Calcul du nombre d'articles
        const prixTotalDuPanier = functionCalculPrixTotalDuPanier(); // Calcul prix total du panier
        let plurielArticleBoutonPanier = "";
        if (totalDesArticlesDuPanier > 1) { // Pluriel à articles
            plurielArticleBoutonPanier = "articles";
        } else {
            plurielArticleBoutonPanier = "article";
        }

        contenuHeader = '<button><a href="index.html">Notre catalogue</a></button><button><a href="panier.html" title="' + prixTotalDuPanier + '€">Panier (' + totalDesArticlesDuPanier + ' ' + plurielArticleBoutonPanier + ')</a></button><button onclick="fonctionClearPanier()">Vider le panier</button>';
    }

    return contenuHeader;
}

/*FIN*/

/*FONCTION AFFICHAGE EN EURO*/
function transformPrice(price) {
    let price_string = price.toString();
    let partie_euro = price_string.slice(0, price_string.length - 2);
    let partie_centimes = price_string.slice(price_string.length - 2, price_string.length);
    let affichage = partie_euro + "." + partie_centimes + "€";
    return affichage;
}
/*FIN*/

/*MESSAGE FLASH UTILISATEUR*/
function affichageMessageAction (vide) {
    let message = localStorage.messagePanier;
    if (message != "vide") {
        let affichageMessageAction = '<div id="textFlashMessage">' + message + '</div>';
        document.getElementById("flashMessage").innerHTML = '<div id="textFlashMessage">' + message + '</div>';
    }
    localStorage.messagePanier = "vide"; // Panier vidé si rechargement de la page
}
/*FIN*/

/*FONCTION CONNEXION SERVEUR JSON*/
var connect = function(url){
    return new Promise(function(resolve, reject){
        var xhr = new window.XMLHttpRequest()
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    resolve(JSON.parse(xhr.responseText))
                } else{
                    reject(xhr)
                }
            }
        }
        xhr.open('GET', url, true)
        xhr.send()
    })
}
/*FIN*/

/*FONCTION AJOUTER DANS LE PANIER*/
function fonctionSubmitProduit (produit) {

    // recupere les donnees du formulaire, déclare les constantes 
    const Id = document.getElementById('id').value; //recupere catalogue
    const option = document.getElementById('option').value; // recupere l'option de lentille
    const quantite = document.getElementById('quantite').value; // recupere quantité produit
    const catalogue = document.getElementById('catalogue').value; // recupere produit
    const retourUrl = document.getElementById('urlRetour').value; // recupere url
    const name = document.getElementById('name').value; // recupere nom du produit
    const prixUnitaire = document.getElementById('prix').value; // recupere prix du produit
    const urlImage = document.getElementById('urlImage').value; // recupere url de l'image du produit
    const description = document.getElementById('description').value; // recupere  description du produit

    //création d'un objet, class pour construire une ligne produit dans le panier:
    class ligneDuPanier {
        constructor(reference, nom, quantite, option, prixUnitaire, prixAjour, catalogue, urlImage, description) {
            this.reference = Id;
            this.nom = nom;
            this.quantite = quantite;
            this.option = option;
            this.prixUnitaire = prixUnitaire;
            this.prixAjour = prixAjour;
            this.catalogue = catalogue;
            this.urlImage = urlImage;
            this.description = description
        }
    }
    // Calcul le prix si plus que 1 dans le panier  
    var prixAjour = prixUnitaire * quantite; 

    // Tri du panier
    if (localStorage.getItem("panier") === "vide") { //si panier vide d'origine car initialisation à null on ecrit directement dans le panier
        const ligne = new ligneDuPanier(Id, name, quantite, option, prixUnitaire, prixAjour, catalogue, urlImage, description);
        var Panier = [];
        Panier.push(ligne); //mis en dernier dans un tableau pour panier
        localStorage.messagePanier = "Produit ajouté"; //Envoi d'un message à l'utilisateur
        localStorage.setItem("panier", JSON.stringify(Panier));
        window.location.href = retourUrl; //Retour à la page du produit
    } else { //Mettre dans panier
        var data = JSON.parse(localStorage.getItem("panier"));

        var produitTrouve = false;
        for (let x in data) {
            if (data[x].reference == Id) {

                produitTrouve = true;

                // Augmente la quantité et le prix
                data[x].quantite++;
                data[x].prixAjour = data[x].quantite * data[x].prixUnitaire;
            }
        }

        if (!produitTrouve) {
            const ligne = new ligneDuPanier(Id, name, quantite, option, prixUnitaire, prixAjour, catalogue, urlImage, description);
            data.push(ligne);
        }

        // Sauvegarde du panier mis à jour
        localStorage.messagePanier = "Produit ajouté";
        localStorage.setItem("panier", JSON.stringify(data));
        window.location.href = retourUrl; // on revient à la page du produit    

    } 
    return false; //fin du else panier non vide
}
/*FIN*/

/* GESTION DU PANIER*////////////////

/*SUPPRIMER PRODUIT*/
let fonctionDelete = function (a) { // supprime un produit du panier
    var data = JSON.parse(localStorage.getItem("panier")); // on recupere le panier en local
    if (data.length == 1) { //supprime le dernier produit
        localStorage.removeItem("panier");
        localStorage.setItem("panier", "vide");
        localStorage.setItem("messagePanier", "Panier vidé !")
        window.location.href = "panier.html"; //Retour à la page d'acceuil */ 
    } else {
        localStorage.messagePanier = "Produit supprimé !"; //Message utilisateur
        data.splice(a, 1); //Supprime l'objet correspondant méthode splice() modifie le contenu du tableau
        localStorage.setItem("panier", JSON.stringify(data));//Sauvegarde du panier mis à jour - JS > JSON
        window.location.href = "panier.html"; //Retour à la page d'acceuil */ 
    }
}
/*FIN*/

/*MODIFICATION QUANTITE PLUS*/

var fonctionQuantitePlus = function (reference) {
    var data = JSON.parse(localStorage.getItem("panier")); //Recupere le panier en local
    var produitTrouve = false;
    for (let x in data) {
        if (data[x].reference == reference) {
            produitTrouve = true;

            //Augmente la quantité et le prix
            data[x].quantite++;
            data[x].prixAjour = data[x].quantite * data[x].prixUnitaire;
        }
    }
    localStorage.messagePanier = "Panier mis à jour";
    // Sauvegarde du panier mis à jour
    localStorage.setItem("panier", JSON.stringify(data));
    window.location.href = "panier.html";
}
/*FIN*/


/*MODIFICATION QUANTITE MOINS*/

var fonctionQuantiteMoins = function (reference) {
    var data = JSON.parse(localStorage.getItem("panier")); //Recupere le panier en local 
    var produitTrouve = false;
    for (let x in data) {
        if (data[x].reference == reference) {
            produitTrouve = true;
            // Augmente la quantité et le prix
            data[x].quantite--;
            data[x].prixAjour = data[x].quantite * data[x].prixUnitaire;
        }
    }
    localStorage.messagePanier = "Quantité mise à jour !";
    // Sauvegarde du panier mis à jour
    localStorage.setItem("panier", JSON.stringify(data));
    window.location.href = "panier.html"; //Retour à la page du panier    
}
/*FIN*/


/*VIDER LE PANIER PAR BOUTON DU HEADER*/

var fonctionClearPanier = function () {
    localStorage.panier = "vide"; // Valeur de panier a vide
    localStorage.messagePanier = "Panier vidé !";
    window.location.href = "index.html"; //Retour à la page accueil
}

/*FIN*/


/*ENVOI DE LA COMMANDE*/

var fonctionSubmitContact = function () {
    const prenom = document.getElementById('prenom').value; //recupere prenom
    const nom = document.getElementById('nom').value; //recupere nom 
    const mail = document.getElementById('email').value; //recupere email
    const ville = document.getElementById('ville').value; //recupere ville 
    const adresse = document.getElementById('adresse').value; //recupere adresse  
    const codePostal = document.getElementById('codePostal').value; //recupere codepostal

    /*format pour l'envoi*/
    class formatToSend {
        constructor(utilisateur, idSacommander) {
            this.contact = utilisateur;
            this.products = idSacommander;
        }
    }
    /*format pour l'utilisateur*/
    class formatUtilisateur {
        constructor(nom, prenom, adresse, ville, mail) {
            this.firstName = prenom;
            this.lastName = nom;
            this.address = adresse;
            this.city = ville;
            this.email = mail;
        }
    }

    /*construction de l'utilisateur*/
    const utilisateur = new formatUtilisateur(prenom, nom, adresse, ville, mail);


    /*construction de l'array avec uniquement les identifiants des produits*/
    var paniersLocal = JSON.parse(localStorage.getItem("panier")); // on recupere le panier
    var idSacommander = [];
    for (var x = 0; x < paniersLocal.length; x++) {
        var ligneProduit = paniersLocal[x];
        idSacommander.push(ligneProduit.reference);
    }

 /*Infos=Ok==> la commande prete a envoyer*/
    const commandeToSend = new formatToSend(utilisateur, idSacommander)

    /*ENVOI*/

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            var response = JSON.parse(this.responseText);
            localStorage.messagePanier = "MERCI";
            localStorage.panier = "vide";
            localStorage.setItem("confirmCommande", response.orderId);
            window.location.href = "confirmation.html"; // Vers la page de confirmation
        }
    }; // fin de la fonction
    xhttp.open("POST", "http://localhost:3000/api/cameras/order");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(commandeToSend));

    return false;
}
/*FIN*/
/*FIN GESTION DU PANIER*/