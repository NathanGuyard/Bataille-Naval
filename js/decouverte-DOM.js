
// Au chargement de la page, on sélectionne la cellule qui a pour ID "cell25" et on la stocke dans une variable
let cell25 = document.getElementById('cell25');
console.log(cell25);

// Au chargement de la page, on sélectionne toutes les cellules qui ont la classe "cell"

let cells = document.getElementsByClassName('cell');
console.log(cells);


// Pour sélectionner des éléments, le plus est simple est d'utiliser les fonctions querySelector et querySelectorAll. Elles reçoivent en argument un sélecteur CSS : #cell22, .cell, div, header, section header > li

cell25 = document.querySelector('#cell25');
console.log(cell25);

cells = document.querySelectorAll('.cell');
console.log(cells);



// Pour modifier un élément, on peut utiliser ses "propriétés" (des sortes de caractéristiques). Celles-ci nous renvoient une donnée (par exemple le contenu texte) ou servent à modifier ces données (modifier le texte d'une balise.)

// Par exemple pour modifier le texte de la cellule 25 : 
cell25.textContent = "<p>Nouveau texte</p>";

// TextContent permet de modifier uniquement du texte. C'est à dire que les balises HTML inscrites dedans ne seront interprétées.
// Pour pouvoir modifier le contenu HTML d'un élément, on utilisera plutot innerHTML
cell25.innerHTML = "<strong>Nouveau texte</strong>";
