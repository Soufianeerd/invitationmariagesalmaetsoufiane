# 00. Overview & Stack Technique

## Stack technique réelle

Après analyse exhaustive du code source, l'application est construite **sans framework JavaScript frontend moderne** et ne requiert pas d'étape de build. Le backend repose sur une architecture serverless avec Google Apps Script.

| Technologie | Version exacte | Source de la version | Fonction | Obligatoire |
| :--- | :--- | :--- | :--- | :--- |
| **HTML** | HTML5 | Constaté (`<!DOCTYPE html>`) | Structure sémantique du site | Oui |
| **CSS** | CSS3 (Vanilla) | Constaté (`style.css`) | Présentation, Layout, Animations | Oui |
| **JavaScript** | ES6 (Vanilla) | Constaté (`invitation.js`) | Comportement, animations, requête API | Oui |
| **Google Apps Script** | V8 Engine | Constaté (`Code.gs`) | Endpoint API, Base de données, Mails | Oui |
| **Python** | Non déterminable | Constaté (`.venv/`, `*.py`) | Scripts utilitaires locaux (non runtime) | Non |
| **Pandas** | Non déterminable | Constaté (`import pandas` dans `process_data.py`) | Script analytique optionnel | Non |
| **Rembg** | Non déterminable | Constaté (`from rembg` dans `detourage_sceau.py`)| Script de traitement d'image optionnel | Non |

> **Constat:** Le projet n’utilise aucun framework frontend (pas de React, Vue, ou Angular) ni de bundler (Webpack, Vite). Les fichiers peuvent être servis directement par n'importe quel serveur web statique.

## Frameworks, Librairies et Outils

Le projet repose massivement sur des technologies natives, complétées par des ressources externes servies via CDN.

| Nom | Version | Fichier déclaratif | Utilisé où | Pourquoi | Runtime/build |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Fonts** | N/A | `index.html` (L11-13) | Partout (UI) | Typographies (Cinzel, Amiri, etc.) | Runtime |
| **Google Maps Embed API** | v1 | `index.html` (L111, L132) | Section Itinéraire | Afficher les cartes de la Mairie / Domaine | Runtime |

*Il n'y a aucun outil de build frontend, ni `package.json`, ni linters ou formatters documentés dans le repository pour le frontend.*

## Python Environment & Lockfiles

Le projet contient un dossier `.venv` (environnement virtuel Python) utilisé pour exécuter deux scripts utilitaires : `detourage_sceau.py` et `process_data.py`. Cependant :

*   Il n'y a pas de fichier `requirements.txt`, `Pipfile.lock` ou `poetry.lock`.
*   Les dépendances identifiées dans le code sont : `rembg`, `Pillow` (via `PIL`), et `pandas`.

## Entry Points

| Entry point | Déclencheur | Initialise | Appelle |
| :--- | :--- | :--- | :--- |
| `index.html` | Navigation URL | Le DOM, charge CSS et JS | `invitation.js`, polices externes |
| `invitation.js` | `DOMContentLoaded` (L3) | Les écouteurs d'événements, observeurs, timers | `toggleGuestCount()`, `updateCountdown()` |
| `Code.gs` (`doPost`) | Requête POST `fetch` | La logique d'enregistrement Google Sheets | `getOrCreateSheet_`, `buildRow_`, `sendOwnerNotification_` |
| `Code.gs` (`doGet`) | Requête GET sur l'URL GAS | Retour texte brut de test | Aucune |

## Architecture Haute Niveau

Le système est composé de trois éléments principaux :

1.  **Frontend Statique (Client) :** `index.html`, `style.css`, `invitation.js`. Hébergé n'importe où, il affiche l'UI et effectue un `fetch` POST.
2.  **API Serverless (Interface) :** URL Google Apps Script (`https://script.google.com/.../exec`) configurée en `no-cors` côté client.
3.  **Stockage & Notification (Backend) :** Google Sheets (pour persister les RSVP) et Gmail (pour envoyer des accusés de réception).
