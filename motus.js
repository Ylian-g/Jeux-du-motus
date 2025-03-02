const tab = ['ABIMER', 'BERCER', 'CHUTER', 'DANSER', 'EFFORT', 'FIGURE', 'GRIFFE',
    'HUMEUR', 'JOUEUR', 'LANCER', 'MOTEUR', 'NATURE', 'OFFRIR', 'PARDON',
    'QUOTER', 'RENDRE', 'SAUTER', 'TOMBER', 'VALIDE', 'ZENITH', 'BAGARRE',
    'CHANCEUX', 'CLOCHER', 'DORMEUR', 'ELOIGNE', 'FRAGILE', 'GRELOTS',
    'HORIZON', 'JOUEUSE', 'LECTURE', 'MUSIQUE', 'NOTABLE', 'OFFRIRA',
    'PLONGER', 'BONHEUR', 'RAVIVER', 'SOUTENU', 'TOMBEAU', 'VIBRANT',
    'ZEPHYRS', 'BALAYAGE', 'QUERELLE', 'DYNAMITE', 'ECLAIRER', 'FRACTURE',
    'HORIZONS', 'ISOLANTE', 'JONGLEUR', 'LUMIERES', 'MUSICIEN', 'NOUVELLE',
    'OCTOGONE', 'PANTHERE', 'PLAISIR', 'RONGEURS', 'SOUFFLER', 'TORNADES',
    'VIBRANTE', 'ZIGZAGUE', 'ABRICOTIER', 'COMPETENCE', 'CASCADEUR',
    'IMPORTANT', 'ENVELOPPE', 'FIGURINES', 'GONDOLIER', 'HARMONISE',
    'ILLUMINER', 'TORNADIER', 'DENTIFRICE', 'BOUQUINISTE', 'CHARCUTIER',
    'DEBORDEMENT', 'ENCAPSULER', 'FORMATION', 'GENEROSITE', 'HARMONIEUX',
    'ILLUSTRER', 'JACASSERIE', 'KILOMETRER', 'LANCEMENT', 'MAGNETIQUE',
    'NAVIGATION', 'OBSERVATEUR', 'PERCEPTION', 'QUESTIONNE', 'RADIATEURS',
    'SYMPATHIES', 'TELEPHONER'];

const Tries = 6; // Nombre de tentatives

// Variables du jeu
let motCourant = '';
let ligneActive = 0;
let partieTerminee = false;

// fonction qui séléctionne un mot aléatoire
function SelectWord() {
    return tab[Math.floor(Math.random() * tab.length)];
}

// fonction qui créer la grille
function CreateGrid() {
    const grille = document.getElementById('Grille');
    grille.innerHTML = ''; // On vide la grille

    // On choisit un mot au hasard
    motCourant = SelectWord();
    ligneActive = 0;
    partieTerminee = false;

    // On crée les lignes pour les essais
    for (let i = 0; i < Tries; i++) {
        let ligne = document.createElement('div');
        ligne.className = 'row';
        ligne.id = 'ligne-' + i;

        // ont donne ces caratéristique pour chaque lettre
        for (let j = 0; j < motCourant.length; j++) {
            let case_lettre = document.createElement('input');
            case_lettre.type = 'text';
            case_lettre.maxLength = 1;
            case_lettre.className = 'letter-box';
            case_lettre.id = `case-${i}-${j}`;

            // On bloque toutes les lignes sauf la première
            if (i > 0) {
                case_lettre.disabled = true;
            }

            // Quand on tape une lettre
            case_lettre.addEventListener('input', function() {
                // On met en majuscule
                this.value = this.value.toUpperCase();

                // On passe à la case suivante
                let caseSuivante = this.nextElementSibling;
                if (caseSuivante && this.value) {
                    caseSuivante.focus();
                }
            });

            ligne.appendChild(case_lettre);
        }

        grille.appendChild(ligne);
    }

    // On ajoute l'événement qui appele la fonction de vérification au bouton
    let boutonVerifier = document.querySelector('.button');
    boutonVerifier.addEventListener('click', verifierLigne);
}

// Fonction pour vérifier la ligne courante
function verifierLigne() {
    if (partieTerminee) return;

    // On récupère toutes les cases de la ligne utiliser
    let cases = document.querySelectorAll(`#ligne-${ligneActive} input`);

    // On construit le mot proposé
    let motPropose = '';
    let toutRempli = true;

    // On vérifie que toutes les cases sont remplies
    cases.forEach(function(Case) {
        if (!Case.value) {
            toutRempli = false;
        }
        motPropose += Case.value.toUpperCase();
    });

    if (!toutRempli) {
        alert('Il faut remplir toutes les cases!');
        return;
    }

    // Vérification du mot
    let resultats = verifierMot(motPropose, motCourant);

    // Mise à jour des couleurs
    for (let i = 0; i < motPropose.length; i++) {
        let caseActuelle = document.getElementById(`case-${ligneActive}-${i}`);

        // Selon le résultat, on change la couleur
        if (resultats[i] === 2) {
            // Bonne lettre, bonne place (vert)
            caseActuelle.style.backgroundColor = '#1db313';
            caseActuelle.style.color = 'white';
        } else if (resultats[i] === 1) {
            // Bonne lettre, mauvaise place (jaune)
            caseActuelle.style.backgroundColor = '#FFD700';
            caseActuelle.style.color = 'black';
        } else {
            // Mauvaise lettre (gris)
            caseActuelle.style.backgroundColor = '#ff0000';
            caseActuelle.style.color = 'white';
        }

        // On désactive la case
        caseActuelle.disabled = true;
    }

    // On vérifie si le joueur a gagné
    if (motPropose === motCourant) {
        partieTerminee = true;
        setTimeout(() => {
            alert('Bravo! Vous avez trouvé le mot: ' + motCourant);
        }, 100);
        return;
    }

    // Passer à la ligne suivante
    ligneActive++;

    // Si plus de tentatives, c'est perdu
    if (ligneActive >= Tries) {
        partieTerminee = true;
        setTimeout(() => {
            alert('Perdu... Le mot était: ' + motCourant);
        }, 100);
        return;
    }

    // Sinon on active la ligne suivante
    let casesSuivantes = document.querySelectorAll(`#ligne-${ligneActive} input`);
    casesSuivantes.forEach(function(Case) {
        Case.disabled = false;
    });

    // Et on se met à la première case
    if (casesSuivantes.length > 0) {
        casesSuivantes[0].focus();
    }
}

// Fonction qui compare deux mots
function verifierMot(proposition, solution) {
    // 0 = pas bon, 1 = bonne lettre mauvaise place, 2 = bonne lettre bonne place
    let resultat = Array(solution.length).fill(0);
    let lettresRestantes = solution.split('');

    // Premier passage: on cherche les bonnes lettres bien placées
    for (let i = 0; i < proposition.length; i++) {
        if (proposition[i] === solution[i]) {
            resultat[i] = 2;
            lettresRestantes[i] = null; // On marque cette lettre comme utilisée
        }
    }

    // Second passage: on cherche les bonnes lettres mal placées
    for (let i = 0; i < proposition.length; i++) {
        if (resultat[i] === 0) { // Si pas déjà trouvé
            let idx = lettresRestantes.indexOf(proposition[i]);
            if (idx !== -1) {
                resultat[i] = 1;
                lettresRestantes[idx] = null; // On marque cette lettre comme utilisée
            }
        }
    }

    return resultat;
}

// Lancement du jeu au chargement de la page
window.onload = CreateGrid;