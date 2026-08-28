# 13. Guide de Personnalisation (White-labeling)

L'application a été conçue autour du mariage de *Soufiane & Salma*. Ce guide explique comment transformer ce code (le "Moteur") pour un tout autre événement (Anniversaire, Séminaire, autre Mariage) **sans écrire de code logique**.

## Remplacer complètement l'UI/UX sans casser l'application

Vous pouvez refaire tout le CSS `style.css` et changer tout le HTML, à condition de **conserver absolument ces identifiants (IDs et inputs)** pour ne pas casser la logique de `invitation.js` :

| ID / Élément à conserver | Utilité JS (Ne pas supprimer) |
| :--- | :--- |
| `id="introBtn"` | Bouton qui ouvre l'invitation et supprime le scroll lock. |
| `id="introScreen"` | Parent de l'écran d'intro qui reçoit la classe `.open`. |
| `id="mainContent"` | Réceptacle du contenu qui s'affiche via `.revealed`. |
| `class="fade-in-up"` | Éléments devant s'animer au fur et à mesure du scroll. |
| `id="days"`, `hours`... | Span(s) recevant les numéros du timer. |
| `id="rsvpForm"` | Le formulaire intercepté lors de la soumission. |
| `id="name"` | Récupère le nom de l'invité. |
| `id="email"` | Récupère l'email de l'invité. |
| `input[name="attendance"]` | Les radios "oui" et "non". |
| `id="guestCountGroup"` | Div cachée dynamiquement si "absent". |
| `id="guests"` | Select du nombre de personnes. |
| `id="allergies"`, `id="message"`| S'ils existent, ils sont lu par le script. |

## Changer d'événement (Mariage → Nouvel Événement)

Voici la matrice de personnalisation de bout en bout pour un nouvel événement (ex: Mariage Youssef & Meryem).

| Je veux modifier | Source exacte | Modification requise | Risque |
| :--- | :--- | :--- | :--- |
| **Prénoms Hero Section** | `index.html` L58 | Remplacer "Salma <span class="couple-amp">&</span> Soufiane". | Faible |
| **Noms de famille** | `index.html` L45, L47 | Changer le texte des `span.family`. | Faible |
| **Sceau d'intro** | `assets/seau_v2.webp` | Remplacer l'image (garder la transparence). | Faible |
| **Texture de fond** | `assets/fond-enveloppe.webp` | Remplacer par un autre papier/texture WebP. | Faible |
| **Couleurs du thème** | `style.css` L70-77 | Modifier `--bordeaux`, `--ivory`, `--gold-sand`. | Faible |
| **Typographies (Fonts)** | `index.html` L12 & `style.css` L79-82 | Changer l'URL Google Fonts et remplacer les variables CSS de polices. | Moyen |
| **Adresses & Iframes Map**| `index.html` L111, L132 | Changer le texte et l'URL `src` du widget Google Maps. | Faible |
| **Date du compte à rebours** | `invitation.js` L156 | Remplacer la chaîne textuelle de `Date()`. Ex: `new Date('December 25, 2026 10:00:00')`. | **Élevé** (Si format invalide, le JS casse). |
| **Fichier iCal calendrier** | `index.html` L213 | Remplacer `href="mariage.ics"`. | Faible |
| **Email Organisateur** | `Code.gs` L19 | Remplacer `OWNER_EMAIL`. | **Élevé** (Pas de mail envoyé si invalide). |
| **Titre des Emails Envoyés**| `Code.gs` L22, L23 | Modifier `WEDDING_DATE` et `COUPLE`. | Moyen |

## Configuration Centralisable (Recommandation Architecturale)

Actuellement, les configurations sont dispersées.
Pour transformer ce code en produit générique, il serait recommandé d'isoler les configurations métier dans un objet JavaScript global en tête de fichier (ex: dans un `config.js` chargé avant le reste) :

```javascript
const APP_CONFIG = {
    timerDate: 'October 23, 2026 15:00:00',
    backendUrl: 'https://script.google.com/.../exec'
};
```
Et de la même manière dans `style.css`, regrouper toutes les constantes en haut. Le backend `Code.gs` le fait déjà très bien (lignes 18-25).
