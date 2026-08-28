# 05. Frontend (HTML & JavaScript)

La couche frontend gère l'affichage, les animations et la collecte des données via les formulaires. Il s'agit d'une architecture native stricte (HTML5 / ES6 Vanilla).

## HTML Sémantique

Le document `index.html` est structuré autour de conteneurs classiques, l'absence de framework permettant un contrôle granulaire des ID et classes.

### Frontières des couches

*   **Présentation:** Balises `<section>`, `<header>`, `<footer>`, utilisation de classes comme `.hero-premium`, `.container`, `.info-card`.
*   **Interactions:** ID assignés pour manipulation via `getElementById` (`#introScreen`, `#mainContent`, `#rsvpForm`).
*   **Données (Attributs spécifiques):** Utilisation modeste d'attributs `data-*` (aucun détecté dans l'analyse de ce projet, les identifiants ID suffisent car one-page). L'attribut `lang="ar"` et `dir="rtl"` sur la duaa garantissent une typographie arabe correcte.

## Analyse des fonctions JavaScript (invitation.js)

Le fichier centralise toute la logique d'interaction et de réseau.

### 1. `toggleGuestCount()`
*   **Responsabilité:** Afficher ou cacher la question "Nombre de personnes" dans le RSVP.
*   **Entrées / Sorties:** Lit la valeur du `input[name="attendance"]:checked`, altère `display` du conteneur `#guestCountGroup` et la propriété `required` du select `#guests`.
*   **Callers:** Déclenché lors des événements `change` sur les radios de présence.

### 2. Soumission RSVP (L82-135)
*   **Responsabilité:** Intercepter le formulaire, packager les données, désactiver le bouton, faire l'appel `fetch`, et gérer l'UI Post-soumission.
*   **Dépendances:** `SCRIPT_URL`, DOM Inputs, API `fetch`.
*   **Fonctionnement (Algorithme):**
    1. Prévient l'envoi classique (`e.preventDefault()`).
    2. Vérifie manuellement si une présence est cochée (fallback de sécurité).
    3. Désactive le bouton d'envoi et modifie son libellé.
    4. Récupère les valeurs textuelles de manière "fail-safe" (vérification `if (allergiesInput)` avant d'accéder à la valeur).
    5. Utilise `fetch(SCRIPT_URL, {method: 'POST', mode: 'no-cors', body: JSON.stringify(data)})`.
    6. **.then() :** Puisque le mode est `no-cors`, aucune donnée JSON ne peut être lue. On présume un succès, le formulaire est caché en fondu (500ms transition) et le `#successMessage` est affiché.
    7. **.catch() :** Rétablit le bouton et déclenche un `alert()` natif.

### 3. Intersection Observer (L138-153)
*   **Responsabilité:** Déclencher l'animation `.fade-in-up` lorsque les éléments entrent dans le viewport.
*   **Paramètres:** `threshold: 0.15` (l'élément doit être à 15% visible pour s'animer).
*   **Comportement:** Au croisement, ajoute la classe `.is-visible` et arrête d'observer (`io.unobserve`).
*   **Personnalisation:** Les éléments de la section Hero sont exclus (`!el.closest('.hero-premium')`) car ils ont leur propre séquence d'apparition gérée par `setTimeout` au clic du sceau.

### 4. `updateCountdown()` (L158-184)
*   **Responsabilité:** Calculer le temps restant avant le mariage.
*   **Entrées:** Date cible statique en L156 : `targetDate = new Date('October 23, 2026 15:00:00').getTime()`.
*   **Sortie:** Met à jour le texte du DOM pour `#days`, `#hours`, `#minutes`, `#seconds`.
*   **Callers:** `setInterval` toutes les 1000ms.
*   **Logique de fin:** Si `distance < 0`, remplace tout le bloc par "C'est le grand jour ! ✨".

## Variables Globales / State Global JS

| Nom | Type | Initialisation | Portée | Rôle | Modifiable |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SCRIPT_URL` | `const string` | L2 | Globale (Window) | Endpoint de l'API Apps Script | Oui (Requis au setup) |
| `targetDate` | `const number` | L156 | Closure locale | Date d'expiration du timer en millisecondes | Oui |
| `io` | `IntersectionObserver`| L138 | Closure locale | Gère les fades in progressifs | Non (configuration interne) |
