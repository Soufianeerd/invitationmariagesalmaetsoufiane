# 06. UI & UX

Cette section répertorie l'expérience utilisateur et les interfaces (écrans simulés).

## Écrans (Sections Simulées)

Le projet est "one-page", chaque section agissant comme un "écran" logique.

### 1. Écran d'Introduction (`#introScreen`)
*   **Objectif:** Créer l'effet "Waouh" et empêcher l'accès immédiat au contenu. Donne une dimension physique (ouverture d'enveloppe/portes).
*   **États:** `normal` (portes fermées), `hover` (sceau grossit, glow rouge sombre), `active` (ouverture des portes en 3D, fondu).
*   **Interaction:** Clic obligatoire sur le sceau pour entrer. Scroll verrouillé (`body.locked`).

### 2. Hero Section (`.hero-premium`)
*   **Objectif:** Première impression après ouverture, présenter les noms, familles et date.
*   **Animations (Micro-interactions):** Cascade d'apparition (`fade-in-up`). La basmala, puis les noms de famille, le texte d'invite, les mariés et enfin la date, séparés de 200 à 250ms d'intervalle.
*   **Hiérarchie:** "Salma & Soufiane" domine visuellement (font script, taille massive).

### 3. Section Duaa (`#histoire`)
*   **Objectif:** Élément culturel/religieux. Affiche une Duaa en arabe avec sa traduction.
*   **Composants:** Texte RTL (`dir="rtl"`), séparateur géométrique (gemme dorée `✦`), texte traduit en italique Serif.

### 4. Section Programme / Itinéraire (`#parcours`)
*   **Objectif:** Informer sur les lieux et horaires.
*   **Composants:** Grille (`.itinerary-wrapper`), Iframes Google Maps, Bouton CTA ("Itinéraire") avec icône native (`📍`).
*   **Responsive:** Les colonnes (Mairie/Domaine) se placent l'une sous l'autre sur mobile.

### 5. Section Date & Calendrier (`#compte-a-rebours`)
*   **Objectif:** Créer l'urgence (Countdown) et visuellement marquer la date.
*   **Design Inversé:** Cette section utilise un fond bordeaux (`var(--bordeaux)`) inversant le thème (texte clair) pour marquer une rupture visuelle "Premium".
*   **Composants:** Blocs de compte à rebours, Mini-calendrier simulé en HTML Grid (le jour "23" est entouré d'anneaux dorés CSS), Bouton de téléchargement iCal (`mariage.ics`).

### 6. Section RSVP (`#rsvp`)
*   **Objectif:** Collecter la réponse de l'invité.
*   **UX / Parcours:**
    1. L'utilisateur saisit Nom/Email.
    2. Sélection de la présence (Radio buttons designés sous forme de blocs rectangulaires cliquables, `background: blur`).
    3. *Si "Présent"* : un select "Nombre de personnes" apparaît en fade.
    4. *Si "Absent"* : on ne demande pas le nombre.
    5. Clic sur "Confirmer".
    6. Transition douce : formulaire disparaît (opacity 0), message de remerciement apparaît.

## UX — Micro-interactions & Animations

*   **Hover Sceau:** Scale `1.08` + Drop Shadow (teinte bordeaux). Signal affordant très fort.
*   **Transitions d'état CSS:** Utilisation de `cubic-bezier(0.4, 0, 0.2, 1)` (standard Material design/Apple) pour des animations "smooth" et non linéaires (ex: ouverture de la porte).
*   **Radio Boutons (RSVP):** Utilisation de `:has(input[type="radio"]:checked)` (pour les navigateurs récents) ou changement de fond au hover pour simuler un bouton sélectif de luxe.
*   **Inputs du formulaire:** Bordure inférieure (`border-bottom`) de couleur or. Au `:focus`, la couleur s'intensifie. Pas de bordures lourdes (minimalisme).

## Cartographie des z-index (Profondeur)

La gestion de la superposition (Z-index) est cruciale au chargement.

| Élément | z-index | Remarque |
| :--- | ---: | :--- |
| `.intro-screen` | `9999` | Toujours au dessus de tout pour bloquer l'interaction globale. |
| `.intro-seal-wrapper` | `10` | (Dans l'intro) Au dessus des portes pour pouvoir être cliqué. |
| `.door` | `1` | Au dessus du fond de l'intro, mais sous le sceau. |
| `.special-day` | `1` | (Dans le calendrier) Au dessus de ses anneaux pseudo-éléments (`::before`, `::after`). |
| `.section::before` | `0` | Texture de fond de chaque section (en mode multiply/overlay). Sous le contenu. |

*Note: Le reste du DOM suit l'ordre naturel d'empilement (z-index: auto).*
