# 02. Repository Map (Inventaire Forensique)

Voici l'arborescence complète et exacte du repository sur le disque.

```text
/Users/soufianeelrhadi/Desktop/Mariage/invitation/
├── .DS_Store
├── .git/
├── .gitignore
├── .venv/
├── Code.gs
├── GUIDE-SETUP.md
├── assets/
│   ├── fond-enveloppe.webp
│   ├── image.webp
│   ├── seau_v2.webp
│   └── texture-porte.webp
├── detourage_sceau.py
├── index.html
├── invitation.js
├── process_data.py
└── style.css
```

## Manifeste des Fichiers

L'analyse de tous les fichiers à la racine et des assets révèle la répartition suivante :

| Fichier / Dossier | Taille (bytes) | Lignes | Rôle | Criticité |
| :--- | ---: | ---: | :--- | :--- |
| `index.html` | 11 720 | 286 | Entrée principale de l'application Web. Structure de la page. | **Critique** |
| `style.css` | 22 746 | 1 044 | Contient 100% de la logique visuelle et des animations (Design System complet). | **Critique** |
| `invitation.js` | 7 572 | 189 | Script d'animation DOM, gestion RSVP, et timer. | **Critique** |
| `Code.gs` | 27 189 | 517 | Code backend exécuté sur Google Apps Script. Reçoit les POSTs et envoie emails. | **Critique** |
| `assets/` | N/A | N/A | Dossier contenant les médias nécessaires à l'UI. | **Critique** |
| ↳ `fond-enveloppe.webp` | 394 122 | N/A | Texture de fond globale (multiply blend mode). | Élevée |
| ↳ `image.webp` | 142 084 | N/A | Image de la Basmala arabe (ton sur ton). | Élevée |
| ↳ `seau_v2.webp` | 1 400 690 | N/A | Image haute résolution du sceau royal d'introduction. | Élevée |
| ↳ `texture-porte.webp`| 176 536 | N/A | Texture utilisée pour les deux portes de l'écran d'intro. | Élevée |
| `GUIDE-SETUP.md` | 3 562 | 104 | Documentation d'installation du backend Apps Script pour l'organisateur. | Documentation |
| `detourage_sceau.py` | 645 | 21 | Script utilitaire Python (`rembg`) pour rendre un sceau PNG transparent. Ne fait pas partie du runtime. | Développement |
| `process_data.py` | 378 | 14 | Script utilitaire Python (`pandas`) pour compter les RSVPs depuis un CSV local. | Développement |
| `.gitignore` | 42 | N/A | Exclusion classique de `.venv` ou `__pycache__`. | Configuration |
| `.venv/` | N/A | N/A | Environnement virtuel Python contenant les paquets `rembg` et `pandas`. | Développement |

> **Note sur le SHA-256** : En l'absence d'exigence absolue stricte sur des hash de versioning (et pour éviter d'alourdir inutilement la doc), les tailles exactes en octets font foi pour valider l'intégrité de la réplique (Section 10 de la requête utilisateur).
