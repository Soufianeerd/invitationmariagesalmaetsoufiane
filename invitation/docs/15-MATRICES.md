# 15. Matrices de Traçabilité Absolue

Pour lier toutes les couches de l'application ensemble.

## 1. Matrice Traçabilité Globale (Bout-en-bout)

| Fonctionnalité | UI (Écran) | JS (Action) | Règle Métier | Backend (Code.gs) | Stockage | Test Critique |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Intro Cinématique** | `#introScreen` | `addEventListener` sur sceau | Lock Scroll | N/A | N/A | Ouverture clic |
| **Effet Scroll Fades** | `.fade-in-up` | `IntersectionObserver` | N/A | N/A | N/A | Éléments invisibles -> visibles |
| **Timer** | `#compte-a-rebours` | `updateCountdown()` | S'arrête si distance < 0 | N/A | N/A | 23/10/2026 à 15:00 |
| **RSVP Check Présence** | `#rsvp` (Radio Boutons) | `toggleGuestCount()` | Personnes non requises si Absent | N/A | N/A | Toggle de la div pers. |
| **RSVP Soumission** | `#rsvp` (Form) | `submit` / `fetch` API | Payload JSON valide | `doPost(e)` | Appended Row in Sheet | Fetch Network Call |
| **Envoi Notifications** | N/A (Backend) | N/A | Statistiques sur nb réponses | `sendOwnerNotification` / `sendGuest` | Lecture/Écriture Sheet | Mail reçu |

## 2. Matrice Fichier ↔ Fonctionnalité

| Fichier | Fonctionnalités impactées (Risque en cas de suppression/erreur) |
| :--- | :--- |
| `index.html` | Tout le site casse. Structure DOM manquante, scripts non chargés. |
| `style.css` | Plus aucune animation (le JS retire les classes, mais les classes CSS font la transition). Layout brisé. |
| `invitation.js` | Site bloqué : L'écran d'intro ne s'ouvrira jamais car l'event listener sur le sceau n'existera pas. Le formulaire RSVP rechargera la page au submit sans faire l'API call. |
| `Code.gs` | Le site fonctionnera en apparence, l'invité verra "Merci !", mais **aucune donnée ne sera enregistrée** et aucun mail ne sera envoyé. |
| `assets/seau_v2.webp` | Le bouton d'entrée `#introBtn` affichera une image cassée (alt="Sceau Royal"). |

## 3. Matrice Composant ↔ CSS ↔ JS (Pour refonte UI)

*Si vous souhaitez refaire le CSS, conservez les ID / Classes suivants intacts :*

| Composant | HTML | CSS (Classes d'état clés) | JS | Événements |
| :--- | :--- | :--- | :--- | :--- |
| **Écran Intro** | `div#introScreen` | `.ready`, `.open` | L9-L13, L25-L45 | `setTimeout` ajoute états |
| **Sceau Cliquable** | `img#introBtn` | `transform`, `opacity` animés | L16-L45 | `click` trigger |
| **Body (Page entière)**| `body.locked` | `overflow: hidden` | L27 | Supprimé au clic |
| **Main Content** | `main#mainContent` | `.revealed` (enlève le blur) | L31-L39 | Ajouté après 400ms |
| **Formulaire RSVP** | `form#rsvpForm` | Transition sur l'opacity du form entier | L54, L82-L135| `submit` |
| **Radio Boutons** | `input[name="attendance"]` | Sélecteurs `:has(:checked)` | L58-L80 | `change` |
