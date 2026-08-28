# 08. Règles Métier (Business Logic)

Les règles métier de cette application se concentrent sur le comportement du compte à rebours et la validation du RSVP.

## Règle BR-001 — Fin du compte à rebours

*   **Règle** : Si la date cible (23 Octobre 2026 à 15:00:00) est dépassée, le compte à rebours numérique s'efface.
*   **Implémentation** : Frontend (`invitation.js`, L165).
*   **Action** : Si `distance < 0`, injection de la chaîne statique `"<div class='grand-jour'>C'est le grand jour ! ✨</div>"` dans le DOM.

## Règle BR-002 — Obligation de réponse "Présence"

*   **Règle** : L'invité ne peut pas soumettre le formulaire s'il n'a pas sélectionné explicitement "Je serai présent(e)" ou "Je serai absent(e)".
*   **Implémentation** : Frontend (HTML `required` sur les radios, + validation JS L86).
*   **Action** : Empêche la requête réseau, affiche `alert("Veuillez indiquer votre présence.")`.

## Règle BR-003 — Obligation de réponse "Personnes" (Conditionnelle)

*   **Règle** : Si l'invité indique qu'il sera "Présent", il doit choisir le nombre de personnes (de 1 à 4+). S'il est "Absent", cette information n'a pas de sens métier.
*   **Implémentation** : Frontend (`invitation.js` L70).
*   **Action** : Ajoute ou retire dynamiquement l'attribut HTML `required` du `<select>` "Nombre de personnes" selon le choix du radio bouton.

## Règle BR-004 — Normalisation des données d'absence

*   **Règle** : Si l'invité indique qu'il sera "Absent", le backend doit forcer la valeur du nombre de personnes à "—" (tiret), même s'il avait préalablement sélectionné un nombre avant de changer d'avis.
*   **Implémentation** : Backend (`Code.gs` L135).
*   **Action** : `const nbPersonnes = data.attendance === 'oui' ? (data.guests || '1') : '—';`

## Règle BR-005 — Typage et nettoyage des données (Sanitization basique)

*   **Règle** : Les noms et emails doivent être débarrassés de leurs espaces superflus (trim). L'email doit être enregistré en minuscules. Si un champ facultatif (Allergies) est vide, attribuer une valeur par défaut.
*   **Implémentation** : Backend (`Code.gs` L138-144).
*   **Action** : `(data.email || '').trim().toLowerCase()`, `(data.allergies || 'Aucune').trim()`.

## Matrice Règle Métier ↔ Code

| Règle métier | UI | Fonction frontend | Backend | Configuration |
| :--- | :--- | :--- | :--- | :--- |
| **BR-001** (Timer) | Remplacement DOM | `updateCountdown()` | Non applicable | L156 (Constante JS) |
| **BR-002** (Présence) | Boutons radio cliquables | `submit` handler | Non validé au back | N/A |
| **BR-003** (Nb Pers) | Sélecteur affiché/caché | `toggleGuestCount()` | Non applicable | N/A |
| **BR-004** (Norm. Absents) | Non visible | Non applicable | `buildRow_()` | L135 (GAS) |
| **BR-005** (Nettoyage) | Non visible | Non applicable | `buildRow_()` | L139-L144 (GAS) |

## Workflows Métier

### Workflow 1 : Soumission RSVP (Happy Path)
1. Invité saisit Nom, Email, sélectionne "Présent", indique "2" personnes.
2. Clic "Confirmer ma réponse".
3. JS remplace le texte du bouton par "ENVOI EN COURS..." et le désactive.
4. JS construit payload JSON `{ name, email, attendance, guests, allergies, message }`.
5. JS exécute `fetch` avec mode `no-cors` vers GAS.
6. Backend GAS `doPost` reçoit le payload.
7. Backend insère la ligne dans Google Sheet `getOrCreateSheet_()`.
8. Backend stylise la nouvelle ligne `styleLastRow_()`.
9. Backend génère et envoie l'email récapitulatif à l'organisateur `sendOwnerNotification_()`.
10. Backend génère et envoie l'email de confirmation à l'invité `sendGuestConfirmation_()`.
11. JS `fetch` résout (indépendamment du succès réel du script).
12. JS masque le formulaire (opacity 0) et affiche le `#successMessage`.
