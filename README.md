
🚀 Projet : "The 404th Floor"
Une Escape Room Verticale en Vanilla JS & Tailwind
Le Concept : L’utilisateur est coincé dans un ascenseur glitché. Pour sortir, il doit "réparer" chaque étage en résolvant des énigmes basées sur des manipulations directes du DOM.
L'Objectif UX : Créer une expérience "tactile" et intuitive où chaque action produit un feedback visuel ou sonore immédiat.
🛠 La Stack Technique
 * Style : Tailwind CSS (Animations utilitaires, Grid/Flexbox).
 * Logique : Vanilla JS (Zéro bibliothèque externe).
 * Méthodes clés : appendChild, localStorage, JS Objects, Custom Events.
 * Interactions : Drag & Drop, onkeydown, onclick.
🧩 Les 4 Étapes du Projet (Puzzles UX)
 * L’Étage Électrique (Drag & Drop + appendChild) :
   * Mission : Replacer des fusibles manquants dans le panneau de contrôle.
   * Technique : Glisser une div fusible dans un slot. Utilisation de appendChild pour valider le branchement physiquement dans le DOM.
 * Le Terminal d'Accès (JS Object + Modale) :
   * Mission : Trouver l'identifiant du technicien caché dans le décor pour déverrouiller l'étage.
   * Technique : Une Modale Tailwind s'ouvre. Elle compare l'input de l'utilisateur à un Objet JS contenant les profils autorisés.
 * Le Frein d'Urgence (onkeydown + Gauges) :
   * Mission : Stabiliser la chute de l'ascenseur en martelant une touche.
   * Technique : Un écouteur onkeydown fait monter une barre de progression CSS. Si on s'arrête, la barre redescend (gravité).
 * Le Debug Final (appendChild dynamique) :
   * Mission : Nettoyer les "bugs" (icônes) qui apparaissent aléatoirement sur l'écran.
   * Technique : Création dynamique d'éléments avec createElement et injection via appendChild. Chaque clic supprime l'élément jusqu'à vide complet.
👥 Répartition des Rôles (48h)
 * M1 : L'Architecte (Moteur & État) : Gère le changement d'étage, le localStorage et la structure de la Modale globale.
 * M2 : Le Designer (Tailwind & Motion) : S'occupe de l'aspect visuel de l'ascenseur, des vibrations (shake) et de la cohérence UI.
 * M3 : Le Dev A (Logique Drag/Drop) : Code l'étage 1 (Fusibles) et l'étage 2 (Terminal/Profils).
 * M4 : Le Dev B (Logique Events/Audio) : Code l'étage 3 (Frein), l'étage 4 (Bugs) et intègre les effets sonores (clics, dings).
