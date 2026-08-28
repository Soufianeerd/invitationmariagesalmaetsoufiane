# 10. Data Flow & Stockage

Ce projet ne stocke aucune donnée personnellement identifiable (PII) côté client. Tout est transmis et stocké sur l'écosystème Google de l'organisateur.

## Diagramme du flux de données

```text
 [ INVITE (Navigateur) ]
          │
          ▼
   Saisie DOM Form
          │
          ▼
[ JAVASCRIPT STATE ]
{ name, email, attendance... }
          │
          ▼
  JSON.stringify()
          │
          ▼
    HTTP POST (fetch, no-cors)
          │
          ▼
 [ GOOGLE APPS SCRIPT (Serveur) ]
          │
          ├──▶ Formatage du tableau [Date, Nom, Email, ...]
          │           │
          │           ▼
          │    [ GOOGLE SHEETS ] (Persistance)
          │
          └──▶ Génération Templates HTML
                      │
                      ▼
               [ GMAIL API ] (Mailing)
                      │
                      ├──▶ [ Email Organisateur ] (Statistiques globales + données)
                      │
                      └──▶ [ Email Invité ] (Confirmation RSVP individuelle)
```

## Modèle de Données (Google Sheets)

Une fois arrivé dans le Sheet, la donnée suit un schéma strict défini dans `Code.gs` (L28).

| Index Col | Titre Colonne | Exemple de Donnée | Source / Transformation |
| :--- | :--- | :--- | :--- |
| 0 (A) | `⏱ Date & Heure` | `Wed Oct 23 2026 15:32:00` | Généré par le serveur (`new Date()`) |
| 1 (B) | `👤 Nom & Prénom` | `Marie Dupont` | Input frontend, `.trim()` appliqué |
| 2 (C) | `📧 Email` | `marie.dupont@test.com` | Input frontend, `.toLowerCase()` appliqué |
| 3 (D) | `✅ Présence` | `✅ Présent(e)` | Transformé côté backend (`attendance === 'oui'`) |
| 4 (E) | `👥 Nb. Personnes`| `2` ou `—` | Input frontend si Présent, `—` si Absent |
| 5 (F) | `🍽 Allergies` | `Aucune` | Input frontend, Fallback texte `Aucune` |
| 6 (G) | `💬 Message` | `Félicitations!` | Input frontend, `.trim()` |

## Stockage Client

Le projet est entièrement *Stateless* côté client.
*   **LocalStorage / SessionStorage :** Non utilisés.
*   **Cookies :** Aucun cookie n'est placé par l'application (excepté potentiellement ceux de Google Maps dans les iframes tierces).
*   **Mémoire Volatile :** L'état du formulaire n'est stocké que dans le DOM au moment de la frappe, et dans un objet littéral JSON juste avant l'envoi. Recharger la page efface toute la saisie.

## Scripts Data Locaux (Python)

Le projet contient un script de traitement local `process_data.py` (L1-14).
*   **Données en entrée :** Lit un fichier local nommé `reponses.csv` (supposément exporté manuellement depuis le Google Sheet).
*   **Transformation :** Utilise `pandas` pour créer un DataFrame, et filtre le nombre de lignes où la colonne `Presence` contient l'emoji `✅`.
*   **Sortie :** Affiche simplement un résumé dans le terminal (`📊 RÉSUMÉ : X présents sur Y réponses.`).
*   **Persistance :** Aucune (analyse en lecture seule).
