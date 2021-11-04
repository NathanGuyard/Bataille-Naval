/**
 * Module servant à gérer tout ce qui est lié aux statistiques
 */
const stat = {

    // Propriété servant de compteur de tours
    turn: 1,
    /**
     * Méthode mettant à jour le compteur
     */
    updateTurn: function() {

        // On commence par incrémenter le compteur
        stat.turn++;

        // On sélectionne le titre à metttre à jour
        const title = document.querySelector('h3');

        // On met à jour le titre avec le nouveau tour
        title.textContent = "Tour " + stat.turn;

    },

    handleStatsClick: function() {

        // On n'affiche les stats que si on a fait au moins un tir, donc qu'on est au moins au tour 2
        if(stat.turn > 1) {

            // On récupère le nombre de cases touchées (donc de tirs réussis)
            const hits = document.querySelectorAll('.hit').length;
            
            
            // On récupère aussi le nombre de cases non touchées (tirs ratés)
            const splash = document.querySelectorAll('.splash').length;
            
            // On calcule le nombre de tirs total
            const total = hits + splash;
            
            
            // Avec un produit en croix, on calcule le pourcente de tirs réussis et de tirs ratés
            const hitsPercentage = Math.round(hits * 100 / total) + "%";
            const splashPercentage = Math.round(splash * 100 / total) + "%";
            
            alert("Total des tirs : " + total + " \r\nPourcentage de réussite : " + hitsPercentage + " \r\nPourcentage d'échec : " + splashPercentage);
        } else {
            alert('Il faut faire au moins un tir, pardi !');
        }
            
    },
    // Méthode permettant d'ajouter une ligne à l'historique
    addActionToHistory: function(success) {
        // On récupère le nom de la cellule entré par l'utilisateur;
        const field = document.querySelector('#cellToHit');
        const cellName = field.value;

        // On crée un message qui concatène le numéro du tour et le nom de la cellule
        let message = "Tour #" + stat.turn + " tir en " + cellName;
        
        // Si le paramètre success est égal à true, c'est que c'est un tir réussi. On concatène alors un "réussi" à la fin du message.
        if(success === true) {
            message += " : réussi !";
        } else {
            message += " : manqué...";
        }


        // Commence par sélectionner l'élément qui va contenir les messages.
        const actionsContainer = document.querySelector('#actions');

        // On crée un nouvel élément de type <p> avec la fonction createElement.
        // https://developer.mozilla.org/fr/docs/Web/API/Document/createElement
        const messageElement = document.createElement('div');

        // La constante messageElement contient maintenant un élément HTML qu'on peut modifier meme s'il n'est pas encore présent sur la page.
        // On peut lui ajouter un contenu
        messageElement.textContent = message;
        // Ou une classe
        messageElement.classList.add('message');
        // Et meme un ID
        messageElement.id = "ID-du-message";


        // On place le message en tete du conteneur avec la fonction prepend. Pour l'ajouter à la fin du conteneur, on peut utiliser la fonction append à la place
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend
        actionsContainer.prepend(messageElement);
        
    },
    handleHistoryClick: function(){

        // On sélectionne le conteneur de l'historique
        const actionsContainer = document.querySelector('#actions');

        // La classe hide-actions sert à cacher le conteneur
        // Si la classe hide-actions est présente, on la retire. Sinon on l'ajoute
        // if(actionsContainer.classList.contains('hide-actions')) {
        //     actionsContainer.classList.remove('hide-actions');
        // } else {
        //     actionsContainer.classList.add('hide-actions');
        // }

        // On peut écrire cette condition beaucoup plus rapidement avec toggle
        // https://developer.mozilla.org/fr/docs/Web/API/Element/classList
        actionsContainer.classList.toggle('hide-actions');

    },
    // Fonction permettant d'afficher le nombre  de cellules touchées ainsi que leur ID
    displayHits: function() {

        // On sélectionne toutes les cellules qui ont la class "hit" (donc touchées)
        const hitCells = document.querySelectorAll('.hit');
        // On affiche la longueur du tableau hitCells grace à la propriété length
        console.log("Nombre de cellules touchées : " + hitCells.length);

        // On parcourt le tableau hitCells et on affiche l'attribut de donnée "cell-name" de chaque cellule grace à la propriété "dataset"
        for (const cell of hitCells) {
            // Les "dataset" (attributs de données) sont obligatoirement écrits en kebabCase dans l'HTML. Pour les utiliser en JS, il faut les convertir en camelCase. Donc "cell-name" devient "cellName".
            console.log(cell.dataset.cellName);
        }

    }


}