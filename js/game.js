/**
 * Module qui gère toutes les action du jeu : envoi de missile, vérifications de cellules, de fin de partie, etc
 */
const game = {

    // Fonction appelée par un écouteur lorsque le formulaire est soumis et qui envoie un missile sur la case inscrite dans le champ du formulaire.
    handleFormSubmit: function(event) {

        // On bloque le comportement par défaut du formulaire. C'est à dire faire une requete vers l'url contenu dans l'attribut action ou recharger si cet attribut est vide ou inexistant.
        event.preventDefault();

        // Pour envoyer le missile, on a besoin de récupérer la saisie de l'utilisateur. On commence donc par sélectionner le champ dans lequel on inscrit les coordonnées de la case ciblée
        const field = document.querySelector('#cellToHit');

        // Une fois qu'on a le champ, on peut récupérer ce qu'il contient grace à la propriété value
        const targetedCell = field.value;

        // Si la cellule cible est valide, alors on envoie le missile
        if(game.checkCellName(targetedCell) === true) {
    
            // On envoi le missile sur la cellule ciblée. 
            game.sendMissile(targetedCell);
        } else {
            alert('La case ' + targetedCell + ' n\'existe pas. Veuillez entrer une cellule existante.');
        }

        // On vide la propriété value du champ, donc on vide le contenu du champ sur la page
        field.value = "";

        // Pour pouvoir réécrire dans le champ rapidement, on peut donner le "focus" à ce champ. C'est à dire placer automatiquement le curseur dessus.

        field.focus();
    },
    /**
     * Fonction qui attend en paramètre le nom d'une cellule et qui va vérifier si cette cellule existe. Si elle existe elle renvoie true, sinon elle renvoie false
     */
    checkCellName: function(cellName){

        // Pour vérifier l'existence d'une cellule, il existe plein de méthodes : 
        // - Utiliser une regex (mais on va pas le faire)
        // - Vérifier que la lettre et le chiffre font partie du tableau gridHeaders avec indexOf
        // - Vérifier que la lettre est soit A, soit B, soit C, etc jusqu'à H et que le chiffre soit entre 1 et 8
        // - Utiliser les datasets pour sélectionner la case (solution qu'on va faire)

        // On sélectionne la cellule ciblée avec un sélecteur utilisant les datasets
        const cell = document.querySelector('.cell[data-cell-name="' + cellName + '"]');
        
        // Si la cellule ciblée n'existe pas, la variable cell contient null. Donc le nom de  la cellule n'est pas valide : on retourne false.
        if(cell === null) {
            return false;
        } else {
            return true;
        }

    },

    // Fonction qui envoie un missile sur la case donnée en paramètre.
    sendMissileAt: function(rowIndex, columnIndex) {


        // On veut vérifier que le jeu a déjà commencé. Si ce n'est pas le cas, alors on doit enregistrer la date de début de jeu dans la propriété score.startTime.
        // On considère que le jeu n'a pas commencé si cette propriété est vide

        // Si startTime est vide, le jeu n'a pas commencé, on enregistre la date
        if(score.startTime === "") {
            score.startTime = Date.now();
        }

        // Récupérer la case sur laquelle on a tiré
            // columnIndex nous donne l'index de cette case
            // Le tableau grid contient notre ligne. Comme les fonctions JS sont des passo"cinq" => 
        const targetCell = grid.cells[rowIndex][columnIndex];


        // On définit une variable contenant le retour de la fonction. On indique que par défaut, la fonction retourne "false" (missile qui ne touche rien).
        let returnValue = false;


        // Si la case contient "b", il y avait un bateau, c'est touché !
        // Si la case ne contient rien, c'est un plouf

        if(targetCell === "b"){
            console.log("Touché !");
            // alert('Touché !');

            // Mettre à jour la grille pour ajouter un t à la place du b
            grid.cells[rowIndex][columnIndex] = 't';

            // Vu que le missile touche une case, la fonction doit renvoyer "true". Alors on modifie la valeur de retour pour etre égale à true.
            returnValue = true;

            // Ajouter cette opération à l'historique
            stat.addActionToHistory(true);

            // On augmente le score
            score.increase();

        }
        // Si on cible une case qui contient soit la lettre "p" soit la lettre "t", c'est qu'on cible une case qui a déjà été touchée. Pas besoin de modifier la grille, on affiche juste un petit message.
        else if(targetCell === 'p' || targetCell === 't') {
            // On indique que la case est déjà touchée, on n'envoie pas de missile.
            console.log("Tu sais pas lire ta grille ? On a déjà attaqué cette case, banane");

            // Ajouter cette opération à l'historique
            stat.addActionToHistory(false);

            // On baisse le score
            score.decrease();

        }
        else {
            console.log("Plouf !");
            // alert('Raté, essaie encore !');

            // Mettre à jour la grille pour ajouter un p dans la cellule
            grid.cells[rowIndex][columnIndex] = 'p';

            // Ajouter cette opération à l'historique
            stat.addActionToHistory(false);

            // On baisse le score
            score.decrease();
        }

        // On met à le jour le compteur de tours
        stat.updateTurn();

        // On affiche la grille mise à jour : 
        grid.displayGrid();   

        // On vérifie que le jeu est terminé
        game.checkGameOver();

        return returnValue;
    },


    // Fonction qui permet d'envoyer un missile en lui passant des coordonnées "humaines" (A1, B3, etc)
    sendMissile: function(cellName) {
        // On utilise la fonction getGridIndexes qui traduit notre string (ex: A5) en index (Ex: A5 => row = 4 et column = 0)
        const result = grid.getGridIndexes(cellName);

        console.log(result);
        const rowIndex = result[0];
        const columnIndex = result[1];
        
        // Puis on appelle la fonction sendMissileAt
        // on prend soin de retourner la valeur de retour de sendMissileAt
        // (VRAI si touché, FALSE sinon)
        return game.sendMissileAt(rowIndex, columnIndex);
    },
    // Fonction qui renvoie true si la partie est terminée, false dans le cas contraire.
    // Une partie est terminée quand la grille de contient plus la lettre "b"
    checkGameOver: function() {

        // On stocke le nombre de bateau trouvés dans une variable. On part du principe qu'il y a 0 bateaux, et à chaque fois qu'on en trouve un, on incrémente cette variable.
        let remainingBoats = 0;

        // La boucle for...of permet de parcourir un tableau et de mettre chaque entrée de ce tableau dans une variable (ici la variable row)
        for (const row of grid.cells) {
            // la variable row représente une ligne de la grille et est aussi un tableau. Pour parcourir chaque cellule de la grille, on doit donc parcourir celle-ci avec une autre boucle.
            for (const cell of row) {
                // Ici la variable cell contient successivement chaque celule de la grille. On peut donc vérifier ce qu'elle contient !
                
                if(cell === 'b') {
                    remainingBoats++;
                }

            }
            
        }

        // Si le compteur de bateaux est supérieur à 0, il reste donc des bateaux en jeu : la partie n'est pas terminée !
        if(remainingBoats > 0) {
            return false;
        } else {

            // On enregistre la date d'envoi du dernier missile
            score.endTime = Date.now();


            // On affiche le score de l'utilisateur et on lui demande son nom qu'on récupère dans une variable
            const username = prompt('Jeu terminé ! Voici votre score : ' + score.finalScore() + "\n\rVeuillez entrer votre nom : ");
            
            // On appelle une méthode qui se charge de sauvegarder le nom et le score dans un historique de scores.
            score.add(username, score.finalScore());
        
            // Pour remettre le jeu à zéro, on recharge la page
            document.location.reload();

            return true;
        }

    },

    // Fonction demandant à l'utilisateur de taper des coordonnées de cellule à viser, à travers un prompt.
    // https://developer.mozilla.org/fr/docs/Web/API/Window/prompt
    promptMissileCell: function() {

        // La fonction prompt permet d'afficher une fenetre popup et l'utilisateur entrée du texte dedans. Ce texte sera récupéré dans la variable targetedCell.
        let targetedCell = prompt('Où envoyer le prochain missile ?');

        // On envoie le nom de la cellule récupérée à la fonction sendMissile qui va donc envoyer un missile dessus ! 
        game.sendMissile(targetedCell);
    },
    // Méthode appelée quand clique sur une cellule
    handleCellClick: function(event) {
        // On récupère la cellule ciblée
        const targetedCell = event.target;

        // On récupère le nom de la cellule qui est stocké dans l'attribut de données (dataset) data-cell-name
        const cellName = targetedCell.dataset.cellName;
        
        // On passe le nom de la cellule à la méthode sendMissile qui se charge d'envoyer le missile
        game.sendMissile(cellName);

    }

}