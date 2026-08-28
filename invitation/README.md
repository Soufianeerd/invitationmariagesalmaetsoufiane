# Faire-part Digital Premium — Soufiane & Salma

Bienvenue dans la **documentation forensique intégrale** du projet d'invitation digitale de mariage (Soufiane & Salma).

Ce repository contient une application web "one-page" (Single Page Application statique + backend serverless) conçue pour envoyer des invitations, afficher les détails de l'événement et collecter les RSVP des invités. L'interface propose une expérience premium ("Quiet Luxury") avec un système de portes virtuelles s'ouvrant sur le faire-part.

## Sommaire de la documentation

La documentation a été modulaire afin de couvrir 100% de l'application et de ses comportements.

*   [**00. Overview & Stack Technique**](docs/00-OVERVIEW.md) — Résumé global, technologies détectées.
*   [**01. Architecture**](docs/01-ARCHITECTURE.md) — Contextes système, composants, et approche "Static + GAS".
*   [**02. Repository Map (Arborescence & Fichiers)**](docs/02-REPOSITORY-MAP.md) — Inventaire exhaustif, rôle, criticité et hashes de chaque fichier.
*   [**03. Dependency Graph**](docs/03-DEPENDENCY-GRAPH.md) — Graphes et relations entre fichiers, imports/exports.
*   [**04. Routes & Machine à États**](docs/04-ROUTES.md) — Absence de routeur traditionnel, fonctionnement par état DOM.
*   [**05. Frontend (HTML & JavaScript)**](docs/05-FRONTEND.md) — Structure DOM, événements, timers, et scripts d'animation.
*   [**06. UI & UX**](docs/06-UI-UX.md) — Parcours utilisateur, cinématique d'introduction, formulaires.
*   [**07. Design System**](docs/07-DESIGN-SYSTEM.md) — Palette "Crème & Bordeaux", typographies, media queries, et responsive.
*   [**08. Business Logic (Règles Métier)**](docs/08-BUSINESS-LOGIC.md) — Règles fonctionnelles réelles, calcul du compte à rebours, validations.
*   [**09. Backend (Google Apps Script)**](docs/09-BACKEND.md) — Code.gs, contrats payload, notifications email.
*   [**10. Data Flow & Stockage**](docs/10-DATA-FLOW.md) — Circulation de la donnée depuis le navigateur vers Google Sheets.
*   [**11. Security, Privacy & Accessibilité**](docs/11-SECURITY.md) — Modèle de menace, limites réelles, accessibilité.
*   [**12. Développement & Déploiement**](docs/12-DEPLOYMENT.md) — Exécution locale et déploiement.
*   [**13. Personnalisation (White-label)**](docs/13-CUSTOMIZATION.md) — Comment modifier le projet pour un autre événement.
*   [**14. Reconstruction de Zéro**](docs/14-REBUILD-FROM-SCRATCH.md) — Procédure étape par étape pour rebâtir ce projet depuis un dossier vide.
*   [**15. Matrices de Traçabilité**](docs/15-MATRICES.md) — Tableaux liant UI, CSS, JS, Métier et Backend.

---

## 🎯 Objectif de cette documentation

Cette documentation a été générée via un **audit forensique complet**. L'objectif est de permettre à un développeur de :
1. Comprendre immédiatement le fonctionnement global.
2. Naviguer avec certitude à travers chaque fonctionnalité (de la vue jusqu'au backend Google Sheets).
3. Modifier l'UI sans casser le fonctionnement de l'application.
4. **Reconstruire totalement le produit de zéro** sans avoir accès au code source initial.

---

> Pour commencer, nous vous invitons à lire [l'Overview de la stack technique (docs/00-OVERVIEW.md)](docs/00-OVERVIEW.md).
