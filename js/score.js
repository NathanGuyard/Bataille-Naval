/**
 * Module gérant les scores de la partie
 */
const score = {
    // Propriété stockant le total de points. Au début on commence à zéro
    total: 0,
    // Propriétés permettant de savoir si le jeu a démarré (startTime est vide quand le jeu n'a pas démarré), à quelle heure il a démarré  (startTime contient une date) et à quelle heure il s'est terminé
    startTime: "",
    endTime: "",
    //Propriété permettant de stocker tous les meilleurs scores
    highscore: [],
    // Méthode permettant d'augmenter le total quand on touche un bateau
    increase: function() {
        score.total += 30000;
    },
    // Méthode permettant de diminuer le total quand on touche l'eau
    decrease: function() {
        score.total -= 9000;
    },
    // Méthode permettant de récupérer le score final en retranchant le malus de temps.
    finalScore: function(){

        // On calcule le malus de temps. C'est à dire le nombre de millisecondes écoulées entre le début de la partie et la fin.
        const timeMalus = score.endTime - score.startTime;

        // Selon les règles, on perd 1000pts par seconde de jeu. Une seconde équivalant à 1000ms, alors une milli-seconde équivaut à 1pt.
        // On retire le malus au score total
        const finalScore = score.total - timeMalus;

        // On retourne le score total
        return finalScore;
    },
    add: function(username, userScore) {

        // On crée un petit objet (tableau associatif) qui va représenter le score de l'utilisateur. On a deux propriétés, une pour le nom et une pour le score.
        const newScore = {
            'username': username,
            'score': userScore
        };

        // On ajoute le score au tableau des scores
        score.highscore.push(newScore);

        // On veut stocker le tableau des scores dans le localStorage. Le souci c'est que localStorage ne peut stocker QUE des strings. On doit donc traduire ce tableau de scores en string. Pour faire ça, on va utiliser la boite à outils JSON. 
        // Pour convertir un tableau en string, on utilise JSON.stringify
        const jsonScores = JSON.stringify(score.highscore);
       

        // On sauvegarde le tableau des highscores dans le localStorage
        localStorage.setItem('score', jsonScores);

    },
    // Méthode récupérant les highscores depuis localstorage et les affichant sur la page
    getHighscores: function() {

        // On récupère les infos de score stockées dans le localStorage
        const jsonScores = localStorage.getItem('score');

        // On vérifie qu'on a bien des scores enregistrés.
        if(jsonScores !== null) {
            // Si c'est le cas, on les convertit de JSON vers JS
            const scoresLocalStorage = JSON.parse(jsonScores);
            
            // On stocke les scores récupérés dans la propriété highscore du module
            score.highscore = scoresLocalStorage;

        }


        // On sélectionne l'élément de la page qui va accueillir les scores
        const scoreContainer = document.querySelector('.highscores ul');

        // On boucle sur tous les scores
        for( const currentScore of score.highscore) {

            const newScoreElement = document.createElement('li');

            newScoreElement.innerHTML = "<strong>" + currentScore.username  + "</strong> : " + currentScore.score + " pts";

            scoreContainer.append(newScoreElement);

        }

    }
}