# 12. Développement Local & Déploiement

Étant donné que le frontend est purement statique et le backend géré par Google, le cycle de développement est très direct.

## Développement Local

Aucun serveur Node.js, PHP ou base de données locale n'est requis.

### Procédure de lancement local de zéro :
1. Cloner ou télécharger le repository :
   ```bash
   git clone <URL_DU_REPO>
   cd invitation
   ```
2. Démarrer un serveur web statique. (Ne pas utiliser `file://` car les requêtes `fetch()` et certains modules JS modernes nécessitent un protocole `http://` pour des raisons de CORS ou sécurité navigateur).
   Exemple en Python (déjà installé pour `process_data.py`) :
   ```bash
   python -m http.server 8000
   ```
3. Ouvrir le navigateur sur `http://localhost:8000`.

## Déploiement de Zéro (Mise en production)

### Étape 1 : Le Backend (Google Apps Script)
1. Créer un Google Sheet.
2. Ouvrir **Extensions > Apps Script**.
3. Copier le contenu exact de `Code.gs` du repository vers l'éditeur Google.
4. Modifier les constantes (L18-25) avec les vraies adresses emails.
5. Déployer en tant qu'**Application Web** (`Exécuter en tant que : Moi`, `Accès : Tout le monde`).
6. Copier l'URL sécurisée générée.

### Étape 2 : Le Frontend (Liaison et Hébergement)
1. Coller l'URL copiée dans `invitation.js` L2 (`const SCRIPT_URL = '...';`).
2. Déployer les fichiers statiques (le répertoire entier sans `.venv` ni `.git`) sur l'hébergeur de votre choix.
    *   **GitHub Pages** : Pousser sur la branche `main`, activer GitHub Pages dans les settings (source root).
    *   **Netlify** : Glisser-déposer le dossier ou lier le repo Git. Aucune commande de build (`npm run build`) n'est nécessaire. Le dossier de publication est la racine `./`.
    *   **Serveur mutualisé (Hostinger, OVH)** : Uploader via FTP dans `public_html`.

> **Note sur le HTTPS** : Le déploiement du frontend **DOIT ABSOLUMENT** être sur un domaine en `https://`. Si vous l'hébergez en `http://`, la majorité des navigateurs modernes bloqueront l'appel `fetch` vers l'API Google Apps Script qui est obligatoirement en HTTPS (Erreur *Mixed Content*).
