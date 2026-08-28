# 07. Design System

L'interface est régie par un Design System stricte implémenté via des **CSS Custom Properties (Variables)** dans `:root` au sein de `style.css` (L68-87).

## Palette de Couleurs (Tokens)

L'ambiance est "Quiet Luxury", basée sur un contraste entre des tons crème apaisants et des accents bordeaux/or puissants.

| Token CSS | Hexadécimal | Rôle / Utilisation |
| :--- | :--- | :--- |
| `--ivory` | `#F7F2EA` | Fond de l'écran d'introduction et du Hero. Très clair, chaud. |
| `--cream` | `#FAF7F2` | (Peu utilisé) Variante d'ivoire. |
| `--cream-dark` | `#EFE6DA` | Fond de la section Histoire/Duaa. Offre un contraste léger. |
| `--gold-sand` | `#D4B07B` | Accents, "Et" commercial (`&`), lignes de séparation, bordures focus. |
| `--bordeaux` | `#7A1F2B` | Couleur de marque principale. Texte principal, titres, fond de la section compte à rebours, boutons. |
| `--bordeaux-luxe`| `#7A1F2B` | Alias (même couleur). |
| `--ink` | `#2d1214` | Texte courant (Noir très chaud/marron profond, jamais de #000 absolu). |
| `--muted` | `#9a7c7e` | Textes secondaires, placeholders, descriptions. (Gris chaud). |

## Typographies

Le projet fait appel à Google Fonts pour 4 familles distinctes, chacune ayant un rôle hiérarchique strict.

| Token CSS | Police (Fallback) | Rôle | Poids (Weights) observés |
| :--- | :--- | :--- | :--- |
| `--font-serif` | `'Cormorant Garamond', serif` | Titres de section, Date, boutons, labels. C'est la police "éditoriale" de base. | 300, 400, 500, 600, Italic |
| `--font-display`| `'Cinzel', serif` | Labels sur-titres (ex: "Les familles", "Le Grand Jour"). Très architectural, majuscules natives. | 400, 500, 600 |
| `--font-script` | `'Great Vibes', cursive` | **Noms des mariés et familles**. Utilisée en taille massive (jusqu'à 10rem). | 400 |
| `--font-arabic` | `'Amiri', serif` | Utilisée uniquement pour la Duaa et la basmala. Optimisée pour l'arabe RTL. | 400, 700 |
| `--font-sans` | `'Montserrat', sans-serif` | Textes de base (utilisée sur `body` par défaut), petits labels techniques. | 300, 400, 500 |

## Spacing & Layout

Le projet utilise massivement les fonctions CSS modernes `clamp()` pour un responsive fluide sans breakpoints stricts.

*   **Paddings de section** : `padding: clamp(5rem, 15vw, 10rem) 1.5rem;` (Adapte la hauteur de section à l'écran).
*   **Container Width** : Max `1100px` (large), Max `700px` (étroit, ex: RSVP).
*   **Flex/Grid** : `grid-template-columns: repeat(7, 1fr)` pour le calendrier. `flex-wrap: wrap` pour l'itinéraire.

## Responsive (Media Queries)

Étonnamment, le projet repose presque exclusivement sur `clamp()` pour le texte et les marges, ce qui réduit considérablement les requêtes de médias nécessaires.

Une seule Media Query majeure détectée :
*   `@media (min-width: 900px)` :
    *   Fichier : `style.css` (L574)
    *   Effet : Transforme la section "Compte à rebours + Calendrier" (classe `.calendar-countdown-wrapper`) d'une pile verticale (`flex-direction: column`) à une ligne (`flex-direction: row`).

## Textures & Modes de fusion (Blend Modes)

L'aspect "Luxe" est obtenu en superposant des images de texture.
*   **`assets/fond-enveloppe.webp`** est utilisé comme pseudo-élément `::before` sur toutes les sections. Il est combiné avec `mix-blend-mode: multiply` (sur les fonds clairs) ou `mix-blend-mode: overlay` (sur le fond bordeaux) pour donner une texture "papier grainé".
*   L'image basmala (`assets/image.webp`) utilise un filtre `sepia(0.4) brightness(1) contrast(0.95) grayscale(0.1)` et `mix-blend-mode: multiply` pour s'incruster littéralement dans le fond comme une impression.
