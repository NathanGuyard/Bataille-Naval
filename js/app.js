/**
 * Module principal, il se charge de lancer le jeu et de poser les écouteurs d'événements.
 */
const app = {

    /**
     * Méthode appelée dès le chargement de la page. Elle sert à initialiser le jeu !
     */
    init: function () {
        
        // Dès le chargement de la page, on vérifie que l'utilisateur n'a pas un thème sélectionne grace à ses cookies
        app.loadTheme();

        // Au chargement de la page, on veut aussi récupérer la liste des meilleurs scores enregistrée dans le localStorage.
        score.getHighscores();
        

        // Affichage de la grille
        grid.displayGrid();
    
        // Pour pouvoir jouer, le formulaire doit etre "branché" à notre jeu. C'est à dire qu'on doit pouvoir surveiller ce qu'on rentre dedans.
        // On sélectionne le formulaire
        const form = document.querySelector('.form');
        
        // On pose un écouteur dessus
        form.addEventListener('submit', game.handleFormSubmit);
    
        // On sélectionne le bouton de stats et on pose un écouteur de clic dessus
        const statsButton = document.querySelector('#stats');
        statsButton.addEventListener('click', stat.handleStatsClick);
    
        const historyButton = document.querySelector('#toogle-actions');
        historyButton.addEventListener('click', stat.handleHistoryClick);

        // Pour envoyer des missiles au clic sur les cellules, on doit poser des écouteurs sur celles-ci. On commence donc par toutes les sélectionner.
        const cells = document.querySelectorAll('div.cell');

        for (const currentCell of cells) {
            currentCell.addEventListener('click', game.handleCellClick);
        }

        // Pour changer le thème, on a besoin d'écouter l'événément "change" sur le menu déroulant des thèmes.
        const themeSelect = document.querySelector('#select-theme');
        themeSelect.addEventListener('change', app.handleChangeSelect);
    
    },
    handleChangeSelect: function(event) {
        // Récupérer la valeur choisie dans le select (cible de l'événement)
        // La propriété target contient la cible de l'événement. Cette cible possède une propriété value qui contient le thème choisi.
        const selectedTheme = event.target.value;
        
        // récupérer la balise body
        const body = document.querySelector('body');

        // Modifier la classe du body en y mettant la valeur récupérée
        // La propriété className permet de lister toutes les classes d'un élément ou de redéfinir toutes les classes d'un élément. Ici on remplace toutes les classes du body par la classe du thème choisi.
        body.className = selectedTheme;

        // Maintenant que le thème est modifié, on peut stocker son nom dans un cookie pour le retrouver lors d'une prochaine visite.
        // Un cookie est un petit espace de stockage. Il dispose d'un nom et d'une valeur. On peut aussi lui ajouter certaines options: domaine, date d'expiration etc

        // Ici le nom du cookie est "theme-choisi"
        // Sa valeur est le nom du thème qui vient d'etre appliqué
        // Et il expire dans 1 an
        document.cookie = "theme-choisi=" + selectedTheme + ";max-age=31536000";
    },
    loadTheme: function() {

        // On commence par vérifier qu'on a des cookies
        if(document.cookie != "") {

            // On veut récupérer le cookie appelé "theme-choisi"
            // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#example_2_get_a_sample_cookie_named_test2
            
            const cookieTheme = document.cookie // On récupère la string qui contient tous les cookies. Ces cookies sont séparés par un "; "
            .split('; ') // On casse la string au niveau des "; " ce qui nous donne un tableau où chaque entrée est un cookie
            .find(row => row.startsWith('theme-choisi=')) // On cherche dans le tableau le premier cookie commençant par "theme-choisi=" et on le retourne pour le passer à la fonction suivante
            .split('=')[1]; // On casse le cookie autour du caractère "=", ce qui permet d'avoir un tableau où la première entrée est le nom du cookie, la seconde sa valeur. Qu'on récupère.
            
            // récupérer la balise body
            const body = document.querySelector('body');
            body.className = cookieTheme;
        }


    }
}

// Une fois que toutes les fonctions sont définies, on lance le jeu via une boucle. Tant que la fonction checkGameOver renvoie false, le jeu n'est pas terminé, alors on demande à l'utilisateur de cibler une case.
// tant que le jeu n'est pas terminé
// while (checkGameOver() === false) {
    // on affiche la grille
    // displayGrid();
    // puis on demande au joueur de donner une case
    // promptMissileCell();
// }


// Pour etre sur que notre code JS se lance bien APRÈS le chargement complet de la page, on place un écouteur sur celle-ci pour surveiller l'événement DOMContentLoaded. Ce dernier est émis par le navigateur lorsque toutes les ressources de la page sont bien téléchargées.
// Quand tout est téléchargé, on lance la fonction init ! 
document.addEventListener('DOMContentLoaded', app.init);


