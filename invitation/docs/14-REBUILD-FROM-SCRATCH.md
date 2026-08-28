# 14. Guide de Reconstruction de Zéro

Procédure détaillée, testable et validable pour recréer l'ensemble de l'application si l'intégralité du code source venait à disparaître, basée exclusivement sur ce référentiel documentaire.

## Scénario

*   Vous n'avez que les assets images bruts.
*   Vous n'avez aucun code JS/HTML/CSS initial.

### Étape 1 : Architecture & Configuration Initiale
1.  Créer un dossier de projet : `mkdir nouveau-mariage && cd nouveau-mariage`
2.  Créer les dossiers nécessaires : `mkdir assets`
3.  Placer vos images (`seau_v2.webp`, `fond-enveloppe.webp`, `texture-porte.webp`) dans le dossier `assets/`.
4.  Créer les fichiers vierges : `touch index.html style.css invitation.js`.

### Étape 2 : Le Squelette HTML (`index.html`)
1.  Écrire la structure HTML5 de base (`<!DOCTYPE html>`).
2.  Dans le `<head>`, importer Google Fonts (Cinzel, Cormorant Garamond, Great Vibes, Amiri, Montserrat).
3.  Lier `style.css` et `invitation.js` en fin de `<body>`.
4.  Créer le verrouillage du body : ajouter `class="locked"` sur le `<body>`.
5.  **Reconstruire l'Intro :** Créer une `div#introScreen`. À l'intérieur, deux `div` pour les portes (`.door--left`, `.door--right`) et une `div` contenant l'image du sceau (`id="introBtn"`).
6.  **Reconstruire le contenu :** Créer `<main id="mainContent">`.
7.  Structurer 5 sections distinctes : Hero (`.hero-premium`), Histoire/Duaa (`#histoire`), Parcours (`#parcours`), Compte à rebours (`#compte-a-rebours`), RSVP (`#rsvp`).

### Étape 3 : Design System et Base Visuelle (`style.css`)
1.  Établir les variables CSS `:root` pour retrouver les couleurs (Ivoire `#F7F2EA`, Bordeaux `#7A1F2B`, Gold `#D4B07B`) et les polices.
2.  Gérer le blocage : `body.locked { overflow: hidden; }`.
3.  Styliser l'intro (`#introScreen`) : position `fixed`, z-index `9999`. Les portes sont positionnées en absolu avec `assets/texture-porte.webp`. Le sceau est centré au milieu.
4.  Gérer le mode "caché" : `#mainContent { opacity: 0; filter: blur(5px); transform: scale(1.03); }`.
5.  Gérer le mode "révélé" : `#mainContent.revealed { opacity: 1; filter: blur(0); transform: scale(1); }`.

### Étape 4 : L'Orchestration JavaScript (`invitation.js` - Partie 1)
1.  Écouter `DOMContentLoaded`.
2.  **La cinématique :** Au clic sur `#introBtn`, supprimer `body.locked`. Appliquer un `opacity: 0` sur le sceau. Ajouter une classe aux portes pour effectuer un `transform: rotateY()` (ouverture 3D en CSS). Après 400ms, ajouter la classe `.revealed` à `#mainContent`.
3.  **L'Intersection Observer :** Créer un `IntersectionObserver`. Cibler tous les éléments `.fade-in-up` et leur ajouter une classe `.is-visible` lorsqu'ils croisent le viewport, pour créer l'effet d'apparition au scroll.
4.  **Le Timer :** Créer `targetDate = new Date(...)`. Dans un `setInterval(..., 1000)`, calculer la différence, et injecter jours/heures/minutes/secondes dans les `<span id="days">`, etc.

### Étape 5 : Le Moteur Fonctionnel / API (`Code.gs`)
1.  Créer un projet sur script.google.com.
2.  Définir `const CONFIG = { OWNER_EMAIL: '...', SHEET_NAME: 'RSVP Invités' ... }`.
3.  Créer la fonction `doPost(e)`.
4.  Parser le JSON (`JSON.parse(e.postData.contents)`).
5.  Récupérer le classeur `SpreadsheetApp.getActiveSpreadsheet()`. Créer l'onglet "RSVP Invités" avec les en-têtes (Date, Nom, Email, Présence...) si inexistant.
6.  Insérer la ligne avec `sheet.appendRow()`.
7.  Construire un payload HTML récapitulatif listant tous les confirmés de la feuille.
8.  Envoyer un email via `MailApp.sendEmail()` vers `OWNER_EMAIL`.
9.  Envoyer un email de confirmation via `MailApp.sendEmail()` vers `data.email` s'il existe.
10. Retourner un objet JSON `{success: true}` via `ContentService.createTextOutput()`.
11. Déployer en tant qu'Application Web (accès : Tous).

### Étape 6 : Le Formulaire RSVP (`invitation.js` - Partie 2)
1.  Ajouter l'URI de déploiement GAS en haut de fichier (`const SCRIPT_URL = '...'`).
2.  Écouter l'événement `submit` de `form#rsvpForm`.
3.  Utiliser `e.preventDefault()`.
4.  Construire le payload : `{ name: input.name.value, email: input.email.value, attendance: radio.checked.value, ... }`.
5.  Utiliser `fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) })`.
6.  Dans le `.then()`, masquer le formulaire et afficher un message de remerciement.

### Test de Parité (Checklist Finale)

*   [ ] Est-ce que le scroll est bloqué au chargement initial ?
*   [ ] Est-ce que le sceau réagit au survol ?
*   [ ] Est-ce que les portes s'ouvrent en perspective 3D ?
*   [ ] Est-ce que la basmala et les titres apparaissent un à un (cascade) après ouverture ?
*   [ ] Est-ce que les textes s'animent de bas en haut lors du défilement ?
*   [ ] Est-ce que le compte à rebours s'égrène seconde par seconde ?
*   [ ] Est-ce que sélectionner "Absent" fait disparaître la question "Nombre de personnes" ?
*   [ ] Est-ce que l'envoi du formulaire m'affiche "ENVOI EN COURS" ?
*   [ ] Est-ce qu'une nouvelle ligne apparaît bien dans Google Sheets (formatée proprement) ?
*   [ ] Est-ce que l'organisateur reçoit bien l'email récapitulatif ?
*   [ ] Est-ce que l'invité reçoit bien un mail accusant réception ?
