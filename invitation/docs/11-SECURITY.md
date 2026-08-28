# 11. Security, Privacy & Accessibilité

## Modèle de menace & Sécurité (Threat Model)

L'architecture serverless induit des risques de sécurité spécifiques.

| Risque | Protection actuelle | Résiduel / Limitation | Recommandation |
| :--- | :--- | :--- | :--- |
| **Injection XSS via le formulaire** | Le backend (GAS) inclut une fonction `esc_()` qui échappe les tags HTML avant de les injecter dans les emails. | Le Sheet stocke la donnée brute. (Pas d'exécution JS dans Sheet). | Sécurisé en l'état actuel. |
| **Spam de RSVP (Déni de service)** | Aucune limite de requête (Rate limiting) côté client. | N'importe qui connaissant l'URL GAS peut envoyer des centaines de requêtes POST. | Ajouter un reCAPTCHA caché au formulaire HTML. |
| **Double soumission accidentelle** | JS désactive le bouton `Confirmer` après le clic (L93: `btn.disabled = true`). | L'utilisateur peut recharger la page et resoumettre. Le backend n'a pas de logique d'upsert (mise à jour) par adresse email. | Traiter la dé-duplication par Email côté Google Apps Script. |
| **Exposition du Endpoint Backend** | L'URL `SCRIPT_URL` est visible publiquement dans `invitation.js`. | L'URL GAS ne peut pas être protégée car elle doit accepter les requêtes non authentifiées. | Normal pour cette architecture. |

## Limites Exactes (Valeurs codées en dur)

| Paramètre | Valeur exacte | Fichier | Frontend/Backend | Conséquence |
| :--- | :--- | :--- | :--- | :--- |
| **Délai intro-screen ready** | 500 ms | `invitation.js` L9 | Frontend | Temps avant que l'opacité de l'écran n'apparaisse. |
| **Délai ouverture portes** | 400 ms | `invitation.js` L25 | Frontend | Le contenu derrière se révèle après ce court instant post-clic. |
| **Délai suppression portes** | 2000 ms (2s) | `invitation.js` L41 | Frontend | Retire l'intro du DOM (display none) pour libérer la mémoire. |
| **Stagger animation Hero** | 250 ms / élément | `invitation.js` L37 | Frontend | Les textes "Les familles", "Mariés" etc. apparaissent en cascade. |
| **Rafraîchissement Timer** | 1000 ms (1s) | `invitation.js` L186| Frontend | Mise à jour du Countdown. |

## Privacy (Confidentialité)

L'application manipule des données d'identification indirecte :
*   `Nom, Email, Présence, Régime alimentaire, Message`.
Ces données sont transmises en HTTPS à Google, et sont hébergées sur le compte privé Google de l'organisateur (Google Sheets + Gmail). Aucune politique de confidentialité (RGPD) ni consentement formel n'est affiché sur le formulaire (acceptable pour un événement privé de ce type).

## Accessibilité (A11y)

| Élément audité | État | Remarque |
| :--- | :--- | :--- |
| **HTML Sémantique** | **Présent** | Utilise `<main>`, `<section>`, `<form>`, `<header>`/`<footer>` implicites. |
| **Textes alternatifs** | **Partiel** | Les images principales ont un `alt=` (`alt="Sceau Royal"`, `alt="Bismillah..."`). |
| **Contraste** | **Présent** | Le bordeaux sur crème / blanc sur bordeaux garantit un fort contraste de lecture. |
| **Focus & Clavier** | **Absent** | Le sceau d'introduction `#introBtn` est une balise `<img>` (L24) sans attribut `tabindex="0"`. Un utilisateur clavier ne peut pas ouvrir l'invitation. |
| **Attributs ARIA** | **Présent** | Le séparateur géométrique décoratif de la duaa contient `aria-hidden="true"` (L79). |
