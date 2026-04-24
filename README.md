# 💍 Mariage Soufiane & Salma — Documentation Complète

> **Date du mariage :** Vendredi 23 Octobre 2026  
> **Lieux :** Mairie de Toul (cérémonie) · Domaine de Camélia (réception)  
> **Palette :** Crème `#F9F7F2` + Bordeaux `#5D262C` — Quiet Luxury  
> **Polices :** Cormorant Garamond (titres) · Montserrat (textes)

---

## 📦 Vue d'ensemble du projet

Ce dépôt contient **3 micro-applications web indépendantes** conçues pour le mariage de Soufiane & Salma. Chacune est une page HTML autonome deployable séparément (Netlify, GitHub Pages, etc.), et s'intègre à l'écosystème **Google (Apps Script + Drive + Sheets)** pour le stockage des données — sans aucun serveur à louer.

```
Mariage/
├── README.md                     ← Ce fichier
├── invitation/                   ← 🎴 Faire-part digital + formulaire RSVP
├── livre-or-audio/               ← 🎤 Livre d'or vocal (messages audio)
└── livre-photos/                 ← 📸 Album photo collaboratif
```

---

## 🏗️ Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                     Invité (navigateur mobile / desktop)        │
│                                                                 │
│   ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│   │  invitation  │  │ livre-or-audio   │  │  livre-photos    │  │
│   │  (RSVP)      │  │ (messages audio) │  │  (photos)        │  │
│   └──────┬───────┘  └────────┬─────────┘  └────────┬─────────┘  │
│          │ fetch POST        │ fetch POST              │ fetch POST │
└──────────┼───────────────────┼─────────────────────────┼──────────┘
           ▼                   ▼                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Google Apps Script (doPost)                    │
│  ┌─────────────────┐  ┌───────────────────┐  ┌───────────────┐  │
│  │   Code.gs        │  │ Code-livre-or.gs   │  │ Code-livre-   │  │
│  │ → Google Sheets  │  │ → Google Drive     │  │ photos.gs     │  │
│  │ → Email RSVP     │  │ → Google Sheets    │  │ → Drive       │  │
│  └─────────────────┘  └───────────────────┘  │ → Email invité│  │
│                                               └───────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📐 Système de design partagé

Les 3 applications partagent un design system cohérent (« Quiet Luxury ») :

| Token CSS            | Valeur       | Usage                              |
|---------------------|--------------|------------------------------------|
| `--cream`           | `#F9F7F2`    | Fond principal, toiles de fond     |
| `--cream-dark`      | `#F0EBE3`    | Fond légèrement plus sombre        |
| `--cream-mid`       | `#EDE8DF`    | Sections alternées                 |
| `--bordeaux`        | `#5D262C`    | Couleur principale, boutons, accents|
| `--bordeaux-lt`     | `#7a3339`    | Bordeaux clair pour les survols    |
| `--bordeaux-pale`   | `#f0e8e8`    | Fond radio/toggle sélectionné      |
| `--ink`             | `#2d1214`    | Texte principal, titres sombres    |
| `--muted`           | `#9a7c7e`    | Texte secondaire, sous-titres      |
| `--font-serif`      | Cormorant Garamond | Titres, citations            |
| `--font-sans`       | Montserrat   | Textes courants, labels, boutons   |
| `--font-arabic`     | Scheherazade New | Textes arabes (invitation only)|

---

## 📁 Module 1 — `invitation/`

### Rôle
Faire-part digital premium accessible via un lien partagé. Contient une animation d'ouverture théâtrale (rideaux), un compte à rebours, la carte du parcours, et le formulaire RSVP.

### Fichiers

| Fichier           | Taille    | Rôle                                                       |
|-------------------|-----------|------------------------------------------------------------|
| `index.html`      | 67 Ko     | Application principale (HTML + CSS inline + JS inline)     |
| `style.css`       | 26 Ko     | Feuille CSS externe (version avec animation enveloppe)     |
| `Code.gs`         | 27 Ko     | Google Apps Script — backend RSVP                          |
| `GUIDE-SETUP.md`  | 3.7 Ko    | Guide pas-à-pas de déploiement du RSVP                     |

---

#### `index.html` — Structure des sections

| Section HTML (`id`)  | Componsant            | Description                                                    |
|---------------------|-----------------------|----------------------------------------------------------------|
| `#introScreen`       | Écran d'intro         | Rideaux bordeaux s'ouvrant en théâtre avec Bismillah + prénoms |
| `#accueil`           | Hero                  | Prénoms en grand, date, lieu, bouton CTA vers RSVP             |
| `#histoire`          | Histoire & Duaa       | Versets coraniques (arabe + traduction) + cartes de souvenirs  |
| `#parcours`          | Carte au trésor       | Planning visuel des 4 étapes de la journée                     |
| `#details`           | Détails pratiques     | Cartes pour cérémonie, réception, tenue, contact               |
| `#compte-a-rebours`  | Countdown             | Compte à rebours en temps réel jusqu'au 23/10/2026 à 15h00    |
| `#rsvp`              | Formulaire RSVP       | Présence, nombre de convives, allergies, message               |
| Footer                | Pied de page          | Noms, date, droits                                             |

#### `index.html` — Fonctionnalités JavaScript

- **Écran intro** : Animation rideaux (`.intro-curtain`) avec classe `.open` via `IntersectionObserver`
- **Navigation dots** : Mise en évidence automatique du dot selon la section visible
- **Compte à rebours** : `setInterval` recalculant jours/heures/minutes/secondes chaque seconde
- **Formulaire RSVP** : Validation côté client, champ conditionnel (nb personnes si « Oui »), fetch POST vers Google Apps Script, messages de confirmation personnalisés (Oui / Non)
- **Scroll animations** : `.fade-in-up` déclenché par `IntersectionObserver` à l'entrée dans le viewport

#### `index.html` — Personnalisation rapide

Cherchez les balises `[EDIT]` dans le code pour modifier :

```
[EDIT] Titre de l'onglet         → <title>
[EDIT] Prénoms des mariés        → .intro-names + .hero__name
[EDIT] Date du mariage           → .intro-date, .hero__date, JS countdown
[EDIT] Lieu                      → .hero__location
[EDIT] URL Apps Script (RSVP)    → const SCRIPT_URL = '...'
[EDIT] Texte Bismillah           → .intro-bismillah
[EDIT] Duaa (verset coranique)   → .duaa__text + .duaa__translation
[EDIT] Étapes du parcours        → .stop__name, .stop__time, .stop__address
[EDIT] Date limite RSVP          → <strong> dans la section RSVP
```

---

#### `style.css` — Version externe avec animation enveloppe

La feuille CSS externe implémente une **enveloppe 3D interactive** alternative à l'écran rideau de `index.html`. Elle contient :

| Composant CSS        | Description                                                           |
|---------------------|-----------------------------------------------------------------------|
| `.env`              | Boîte enveloppe avec `perspective` 3D                                |
| `.env__flap`        | Rabat triangulaire qui s'ouvre via `rotateX(-195deg)`                |
| `.env__seal`        | Cachet de cire bordeaux cliquable (animation `sealPulse`)             |
| `.env__letter`      | Carte lettre qui « remonte » avec `letterRise` keyframe               |
| `.env-hint`         | Texte indicatif « Cliquez sur le cachet »                             |
| `.env-overlay`      | Overlay plein écran qui disparaît avec classe `.exit`                 |

---

#### `Code.gs` — Backend RSVP Google Apps Script

**Déploiement :** Application Web (POST endpoint)  
**Contact organisateur :** `soufiane.erd@gmail.com`

| Fonction              | Rôle                                                                    |
|----------------------|-------------------------------------------------------------------------|
| `doPost(e)`          | Reçoit le JSON RSVP, crée la ligne dans le Sheet, déclenche les emails |
| `doGet()`            | Test de l'URL de déploiement                                            |
| `getOrCreateSheet_()`| Récupère ou crée l'onglet « RSVP Invités » avec en-têtes stylisés      |
| `initSheetHeaders_()`| Crée les colonnes A–G avec fond bordeaux et ligne d'en-tête figée      |
| `buildRow_(data)`    | Construit le tableau de données pour `appendRow()`                      |
| `styleLastRow_()`    | Applique coloration alternée (crème / crème foncé) + hauteur de 36px   |
| `sendOwnerNotification_()` | Email HTML complet à Soufiane : détails nouvel invité + stats cumulées |
| `sendGuestConfirmation_()` | Email HTML de confirmation à l'invité (si email fourni)          |
| `esc_(str)`          | Échappe les caractères HTML dans les templates email                    |
| `testRSVP()`         | Simule un RSVP fictif — à exécuter pour valider la configuration        |

**Structure du Google Sheet (onglet « RSVP Invités »)** :

| A — Date & Heure | B — Nom & Prénom | C — Email | D — Présence | E — Nb. Personnes | F — Allergies | G — Message |
|-----------------|-----------------|-----------|--------------|-------------------|---------------|-------------|

---

#### `GUIDE-SETUP.md` — Instructions de déploiement RSVP

Guide en 6 étapes :
1. Créer le Google Sheet « RSVP - Soufiane & Salma »
2. Coller `Code.gs` dans Google Apps Script
3. Exécuter `testRSVP` pour valider
4. Déployer comme Application Web (accès : Tout le monde)
5. Copier l'URL `/exec` dans `index.html` → `const SCRIPT_URL`
6. Tester le formulaire dans le navigateur

---

## 📁 Module 2 — `livre-or-audio/`

### Rôle
Application mobile-first permettant aux invités d'enregistrer un message vocal directement depuis leur navigateur (micro du téléphone), puis de l'envoyer aux mariés. Les fichiers audio sont sauvegardés dans Google Drive.

### Fichiers

| Fichier                 | Taille  | Rôle                                                         |
|------------------------|---------|--------------------------------------------------------------|
| `index.html`           | 39 Ko   | Application web (HTML + CSS inline + JS)                     |
| `Code-livre-or.gs`     | 9.1 Ko  | Google Apps Script — réception et stockage des audios        |
| `GUIDE-DEPLOIEMENT.md` | 5.9 Ko  | Guide de déploiement complet (Apps Script + Netlify + QR)    |
| `server.js`            | 8.8 Ko  | Backend Node.js alternatif (Express + Multer)                |
| `package.json`         | 440 o   | Dépendances Node.js (express, multer, cors, nodemon)         |
| `package-lock.json`    | 49.7 Ko | Arbre de dépendances verrouillé                              |
| `node_modules/`        | —       | Modules Node.js installés (112 packages)                     |
| `uploads/`             | —       | Dossier local de réception des audios (backend Node.js)      |

---

#### `index.html` — Flux en 4 étapes

```
Étape 1 — Identité
  └─ Prénom (obligatoire) + Relation optionnelle

Étape 2 — Enregistrement
  └─ Bouton micro → MediaRecorder API
  └─ Visualiseur ondes (9 barres animées SVG)
  └─ Timer temps réel + barre de progression
  └─ Durée max : 60 secondes

Étape 3 — Prévisualisation
  └─ Lecteur <audio> avec le message enregistré
  └─ Récapitulatif (prénom + durée)
  └─ Boutons : Envoyer / Réenregistrer

Étape 4 — Confirmation
  └─ Message de succès avec ornement ✦
```

#### `index.html` — Fonctionnalités techniques

| Fonctionnalité        | API / Technologie                                         |
|----------------------|-----------------------------------------------------------|
| Enregistrement audio  | `MediaRecorder API` (WebM/Opus sur Chrome, MP4/AAC sur Safari) |
| Visualiseur audio     | `AudioContext + AnalyserNode` — barres animées en temps réel |
| Envoi vers Drive      | `fetch` no-cors → Apps Script → `Utilities.base64Decode()` |
| Compatibilité iOS     | Fallback MIME type (`.newBlob(audioBytes, mimeType)`)    |
| Gestion erreurs       | Alert box animée (#alertBox) auto-masquée après 6s       |

**Configuration** (à modifier en haut du script) :

```javascript
const CONFIG = {
  API_URL:      'https://script.google.com/macros/s/.../exec', // ⚠️ À CHANGER
  MAX_DURATION: 60,    // Durée max en secondes
  AUDIO_BITRATE: 64000 // 64 kbps — bon compromis qualité/taille
};
```

> ⚠️ L'URL Apps Script est actuellement **préremplie** (déployée lors du développement). Vérifiez qu'elle est toujours active avant le mariage.

---

#### `Code-livre-or.gs` — Backend Google Apps Script

**Dossier Drive créé automatiquement :** `"Livre d'Or Audio — Mariage S&S 🎙️"`

| Fonction               | Rôle                                                              |
|-----------------------|-------------------------------------------------------------------|
| `doPost(e)`           | Décode l'audio base64, crée le fichier dans Drive, logue dans Sheets |
| `doGet()`             | Test de déploiement + affiche le nombre de fichiers reçus         |
| `getOrCreateFolder()` | Récupère ou crée le dossier Drive par son nom                     |
| `logToSheet()`        | Ajoute une ligne dans l'onglet « Messages Audio » du Google Sheet |
| `sanitizeFilename()`  | Nettoie le nom de fichier (caractères dangereux → `_`)             |
| `buildResponse()`     | Réponse JSON standardisée avec Content-Type JSON                  |
| `listerTousLesAudios()` | Liste tous les fichiers audio reçus dans les logs (post-mariage) |

**Configuration à remplir** :

```javascript
const DRIVE_FOLDER_NAME = "Livre d'Or Audio — Mariage S&S 🎙️";
const SHEET_ID = '';  // ← Collez l'ID du Google Sheet ici
const SHEET_TAB_NAME = 'Messages Audio';
```

---

#### `server.js` — Backend Node.js alternatif

Alternative au déploiement Google Apps Script — utile pour un hébergement traditionnel (VPS, Railway, Render).

| Route                    | Méthode | Description                                        |
|-------------------------|---------|----------------------------------------------------|
| `/`                      | GET     | Statut du serveur + nombre de fichiers audio       |
| `/upload`                | POST    | Reçoit un fichier audio via `multipart/form-data`  |
| `/audios`                | GET     | Liste tous les fichiers audio avec métadonnées      |
| `/download/:filename`    | GET     | Télécharge un fichier audio spécifique              |

**Sécurité :**
- Vérification MIME type (WebM, MP4, M4A, OGG, WAV)
- Taille max : 15 Mo par fichier
- Nettoyage du nom de fichier côté serveur
- Vérification path traversal (`filePath.startsWith(UPLOAD_DIR)`)
- CORS configuré (à restreindre en production)

**Lancer le serveur :**

```bash
cd livre-or-audio/
npm install        # Installe express, multer, cors, nodemon
npm start          # Démarrage production (node server.js)
npm run dev        # Développement avec hot-reload (nodemon)
```

---

#### `GUIDE-DEPLOIEMENT.md` — Checklist déploiement complet

```
□ 1. Créer le Google Apps Script (Code-livre-or.gs)         ~10 min
□ 2. Renseigner SHEET_ID dans le script (optionnel)
□ 3. Déployer le script → copier l'URL /exec
□ 4. Coller l'URL dans index.html → CONFIG.API_URL
□ 5. Déployer index.html sur Netlify (drag & drop)          ~5 min
□ 6. Tester sur iPhone ET Android
□ 7. Générer le QR code (qr.io, couleur bordeaux #5D262C)   ~15 min
□ 8. Imprimer : carton table / chevalet entrée / menu
```

**Compatibilité mobile garantie :**

| Navigateur        | Format audio | Statut      |
|------------------|-------------|-------------|
| Chrome Android   | WebM / Opus  | ✅ Parfait   |
| Safari iOS 14.3+ | MP4 / AAC    | ✅ Parfait   |
| Firefox Android  | WebM         | ✅ OK        |
| Samsung Internet | WebM         | ✅ OK        |

---

## 📁 Module 3 — `livre-photos/`

### Rôle
Application mobile-first permettant aux invités de prendre ou d'importer une photo, de lui ajouter une légende, et de l'envoyer aux mariés. Les photos sont stockées dans Google Drive et l'invité peut recevoir une copie par email.

### Fichiers

| Fichier                    | Taille  | Rôle                                                        |
|---------------------------|---------|-------------------------------------------------------------|
| `index.html`              | 44 Ko   | Application web (HTML + CSS inline + JS)                    |
| `Code-livre-photos.gs`    | 19.3 Ko | Google Apps Script — réception, stockage et notifications   |

---

#### `index.html` — Flux en 4 étapes

```
Étape 1 — Identité
  └─ Prénom (obligatoire) + Relation optionnelle

Étape 2 — Sélection photo
  └─ Bouton caméra (capture="environment" → caméra arrière)
  └─ Bouton galerie (photos existantes)
  └─ Zone drag & drop (desktop)

Étape 3 — Aperçu + légende + options
  └─ Prévisualisation de la photo compressée
  └─ Métadonnées (nom fichier + poids après compression)
  └─ Champ légende optionnel (120 char max)
  └─ Toggle « Recevoir ma photo par email » → champ email conditionnel
  └─ Barre de progression upload
  └─ Boutons : Envoyer / Changer de photo

Étape 4 — Confirmation
  └─ Miniature de la photo envoyée
  └─ Message de remerciement
  └─ Bouton « Sauvegarder sur mon téléphone »
  └─ Bouton « Ajouter une autre photo »
```

#### `index.html` — Fonctionnalités techniques avancées

| Fonctionnalité           | Implémentation                                                        |
|-------------------------|-----------------------------------------------------------------------|
| Compression image        | `Canvas API` — redimensionne à 1400px max, encode en JPEG 85%        |
| Double compression       | Si blob > 2 Mo : re-compression à 1000px / 70% qualité              |
| Drag & drop              | `dragover` / `dragleave` / `drop` events sur `.photo-zone`           |
| Envoi base64             | `FileReader.readAsDataURL()` → base64 → JSON POST → Apps Script      |
| Timeout fetch             | `AbortController` avec timeout de 45 secondes                        |
| Retry automatique         | 1 tentative de renvoi en case d'échec réseau                         |
| Sauvegarde téléphone      | Lien `<a download>` avec ObjectURL de l'image compressée             |

**Configuration** (à modifier en haut du script) :

```javascript
const CONFIG = {
  API_URL:    'https://script.google.com/macros/s/.../exec', // ⚠️ À CHANGER
  MAX_WIDTH:  1400,   // Largeur max de la photo compressée (px)
  QUALITY:    0.85,   // Qualité JPEG (0.0–1.0)
  MAX_MB:     20      // Taille max du fichier original (Mo)
};
```

> ⚠️ L'URL Apps Script est actuellement **préremplie** (déployée lors du développement). Vérifiez qu'elle est toujours active avant le mariage.

---

#### `Code-livre-photos.gs` — Backend Google Apps Script

**Dossier Drive créé automatiquement :** `"Livre Photos Souvenirs — Mariage S&S 📸"`

| Fonction                    | Rôle                                                                  |
|----------------------------|-----------------------------------------------------------------------|
| `doPost(e)`                 | Reçoit la photo base64, la sauvegarde dans Drive, déclenche les emails |
| `logToSheet_()`             | Ajoute une ligne dans l'onglet « Photos Souvenirs »                   |
| `sendOwnerNotification_()`  | Email à Soufiane avec aperçu de la photo inline et lien Drive         |
| `sendPhotoToGuest_()`       | Email à l'invité avec la photo en pièce jointe (si option activée)   |
| `getOrCreateFolder_()`      | Récupère ou crée le dossier Drive                                     |
| `sanitize_(name)`           | Nettoie le nom de fichier                                             |
| `esc_(str)`                 | Échappe les entités HTML pour les templates email                     |
| `buildResponse_(data)`      | Réponse JSON standardisée                                             |
| `doGet()`                   | Test de déploiement + comptage des photos                             |
| `testSetup()`               | ✅ À exécuter avant le mariage — teste Drive + Sheet + email          |
| `listerToutesLesPhotos()`   | Liste toutes les photos dans les logs (post-mariage)                  |

**Configuration à remplir** :

```javascript
const DRIVE_FOLDER_NAME = "Livre Photos Souvenirs — Mariage S&S 📸";
const SHEET_ID   = '';  // ← Collez l'ID du Google Sheet ici
const SHEET_TAB  = 'Photos Souvenirs';
const COUPLE     = 'Soufiane & Salma';
const WEDDING_DATE = 'Vendredi 23 Octobre 2026';
const OWNER_EMAIL  = 'soufiane.erd@gmail.com';
```

**Structure du Google Sheet (onglet « Photos Souvenirs »)** :

| A — Date | B — Prénom | C — Relation | D — Légende | E — Email | F — Fichier | G — Voir la photo | H — ID Drive |
|---------|-----------|-------------|------------|----------|------------|------------------|-------------|

---

## 🚀 Guide de déploiement rapide — Checklist finale

### Phase 1 — Avant le mariage (~1h)

```
INVITATION
─────────────────────────────────────────────
□ 1. Créer Google Sheet "RSVP - Soufiane & Salma"
□ 2. Coller Code.gs dans Apps Script → nommer "RSVP Faire-part"
□ 3. Exécuter testRSVP() → vérifier Sheet + email
□ 4. Déployer → Application Web → Tout le monde → copier URL
□ 5. Coller URL dans index.html → const SCRIPT_URL = '...'
□ 6. Déployer index.html sur Netlify
□ 7. Partager le lien aux invités

LIVRE D'OR AUDIO
─────────────────────────────────────────────
□ 8. Créer Google Apps Script → coller Code-livre-or.gs
□ 9. Renseigner SHEET_ID (optionnel)
□ 10. Exécuter doGet() → autoriser Drive + Sheets
□ 11. Déployer → Application Web → copier URL
□ 12. Coller URL dans livre-or-audio/index.html → CONFIG.API_URL
□ 13. Déployer sur Netlify → noter l'URL
□ 14. Générer QR code (couleur bordeaux #5D262C)
□ 15. Imprimer les supports QR (cartons de table, chevalets)

PHOTOS SOUVENIRS
─────────────────────────────────────────────
□ 16. Créer Google Apps Script → coller Code-livre-photos.gs
□ 17. Renseigner SHEET_ID (peut être le même que les RSVP)
□ 18. Exécuter testSetup() → valider Drive + email
□ 19. Déployer → Application Web → copier URL
□ 20. Coller URL dans livre-photos/index.html → CONFIG.API_URL
□ 21. Déployer sur Netlify → noter l'URL
□ 22. Générer QR code pour les photos
□ 23. Imprimer les supports QR
```

### Phase 2 — Jour J

```
□ Vérifier que les 3 URLs Netlify sont accessibles depuis mobile
□ Tester RSVP, Audio et Photo sur iOS ET Android
□ Vérifier que les emails de notification arrivent
□ Placer les supports QR sur les tables / à l'entrée
```

### Phase 3 — Après le mariage

```
□ Récupérer les RSVP : ouvrir le Google Sheet → onglet "RSVP Invités"
□ Récupérer les audios : Google Drive → dossier "Livre d'Or Audio"
   ou exécuter listerTousLesAudios() dans Apps Script
□ Récupérer les photos : Google Drive → dossier "Livre Photos Souvenirs"
   ou exécuter listerToutesLesPhotos() dans Apps Script
□ Télécharger tout en ZIP depuis Google Drive
```

---

## 🔧 Résolution des problèmes courants

### RSVP

| Problème | Solution |
|---------|---------|
| Formulaire affiche une erreur | Vérifier `SCRIPT_URL` dans index.html (fin du script JS) |
| Email non reçu | Apps Script → Affichage → Journaux d'exécution |
| Onglet Sheet absent | Ré-exécuter `testRSVP()` manuellement |

### Livre d'or audio

| Problème | Solution |
|---------|---------|
| « Accès micro refusé » (iPhone) | Réglages → Safari → Microphone → Autoriser |
| « Accès micro refusé » (Android) | Paramètres Chrome → Microphone → Autoriser |
| « Erreur lors de l'envoi » | Vérifier que `CONFIG.API_URL` se termine bien par `/exec` |
| Audios absents dans Drive | Apps Script → Journaux → vérifier permissions Drive |

### Photos souvenirs

| Problème | Solution |
|---------|---------|
| Photo trop lourde | La compression Canvas gère automatiquement jusqu'à 20 Mo |
| Sheet non mis à jour | Vérifier que `SHEET_ID` n'est pas vide et que le compte a accès |
| Email invité non reçu | Vérifier les logs Apps Script pour l'erreur MailApp |
| Photo absente dans Drive | Vérifier que les permissions Drive ont bien été accordées |

---

## 📊 Récapitulatif technique

| Module               | Tech frontend   | Tech backend         | Stockage              |
|---------------------|-----------------|---------------------|-----------------------|
| Invitation / RSVP    | HTML + CSS + JS | Google Apps Script  | Google Sheets         |
| Livre d'or audio     | HTML + CSS + JS | GAS **ou** Node.js  | Google Drive + Sheets |
| Photos souvenirs     | HTML + CSS + JS | Google Apps Script  | Google Drive + Sheets |

### Dépendances externes (CDN)

- **Google Fonts :** Cormorant Garamond, Montserrat, Scheherazade New
- **Aucune** bibliothèque JS tierce (Vanilla JS pur)

### Taille totale du projet

| Dossier             | Taille     |
|--------------------|------------|
| `invitation/`       | ~127 Ko    |
| `livre-or-audio/`   | ~57 Ko (hors node_modules) |
| `livre-photos/`     | ~63 Ko     |
| **Total hors deps** | **~247 Ko**|

---

## 📧 Contact

**Organisateur :** Soufiane Elrhadi  
**Email notifications :** soufiane.erd@gmail.com  
**Date du mariage :** Vendredi 23 Octobre 2026  
**Cérémonie :** Mairie de Toul — 13 Rue de Rigny, 54200 Toul — 15h00  
**Réception :** Domaine de Camélia — 1 bis Rte de Briey, 57160 Châtel-Saint-Germain — 19h00  

---

*Documentation générée le 15 Avril 2026 · Projet Mariage Digital Soufiane & Salma*
