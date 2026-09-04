# Quel designer êtes-vous ? — Instructions projet

## Contexte

Application SPA (single-page app) en un seul fichier `index.html` (HTML/CSS/JS vanilla, sans framework, sans build). Quiz d'auto-évaluation des compétences design en 8 domaines, avec recommandations de formations personnalisées, pour Popup Design Lab.

- **Source de travail** : `~/Desktop/quel-designer-etes-vous.html`
- **Déploiement** : `~/Desktop/quel-designer-deploy/` (dépôt git séparé, copie du fichier source)
- **Production** : https://quel-designer-etes-vous.popupdesignlab.fr (déploiement Vercel automatique)
- **Backend** : Supabase (auth + tables `profiles`, `quiz_sessions`, `feedback`, `formation_requests`)
- **Analytics** : Umami Cloud (script inline dans le `<head>`)

## Workflow de déploiement (toujours dans cet ordre)

1. Éditer `~/Desktop/quel-designer-etes-vous.html` (fichier source)
2. Tester en local avant tout déploiement (voir section Tests)
3. Copier vers le dépôt de déploiement :
   ```
   cp ~/Desktop/quel-designer-etes-vous.html ~/Desktop/quel-designer-deploy/index.html
   ```
4. `git add index.html && git commit -m "..." && git push` depuis `~/Desktop/quel-designer-deploy`
5. Vercel redéploie automatiquement sur push vers `main`

Ne jamais modifier directement `quel-designer-deploy/index.html` — toujours partir du fichier source sur le Desktop.

## Tests avant déploiement

Le fichier `avatars_data.js` (galerie d'avatars, ~5.5 Mo) est référencé par `index.html` mais absent du Desktop. Avant de tester en local :
```
cp ~/Desktop/quel-designer-deploy/avatars_data.js ~/Desktop/avatars_data.js
```
Lancer un serveur local (`python3 -m http.server <port> --directory ~/Desktop`), vérifier dans le navigateur (Browser pane), puis **supprimer `avatars_data.js` du Desktop** après le test pour ne pas le committer par erreur au mauvais endroit.

Pour simuler un utilisateur/historique sans repasser tout le quiz, injecter directement dans `localStorage` (clé `qd_history_guest` ou `qd_history_<userId>`) via la console du navigateur.

## Workflow des tickets (Notion)

Base "Recettage - Quel designer êtes vous", statuts :
- **À faire** → à traiter
- **A challenger** → donner un avis produit/UX avant d'exécuter (voir section suivante), ne pas foncer tête baissée
- **A vérifier** → déployé, en attente de validation utilisateur
- **Terminé** → validé

Après chaque déploiement, mettre à jour le statut du ticket concerné dans Notion (généralement vers "A vérifier").

## Toujours challenger avant d'exécuter

Sur toute décision UX/produit (pas les corrections de bug pures), donner un avis construit avant d'implémenter :
- Ce qui est solide dans la demande
- Ce qui pose question ou a un coût caché (friction, incohérence avec l'existant, redondance)
- Une proposition concrète si pertinent

Ne pas halluciner de features juste pour répondre à une check-list — dire clairement quand un outil/une commande n'est pas disponible dans l'environnement actuel plutôt que de faire semblant.

## Sécurité

- Le Dashboard admin est réservé à `valeriekoplewicz@gmail.com` (`TEACHER_EMAIL` dans le code) — **le masquage JS seul n'est pas suffisant**, toujours vérifier que les policies RLS Supabase correspondantes existent aussi (tables `profiles`, `quiz_sessions`)
- Ne jamais committer de clé Supabase autre que la clé `anon` publique (déjà présente, c'est normal)

## Domaines et recommandations

8 domaines dans `DOMAINS` (dérivés de `DATA`) : Service Design, User Research, UX Design, UX Writing, UI Design, Design Ops, Design System, UI Engineer.

- `FORMATIONS` : catalogue de formations recommandées, chacune taguée avec les domaines concernés (`domaines: [...]`). **Ne garder que les formations cochées "Recommandations pour l'application"** dans la base Notion "Catalogue des formations Popup".
- `LEVIER_MATRIX` : matrice de combos métier (atout → levier(s) cohérent(s)), synchronisée avec la table Notion "Matrice combos métier (Atout → Levier)". Toute modification de cette matrice doit être répercutée des deux côtés.
- Table Notion "Mapping recommandations par levier" : documente quelle formation sort pour quel domaine — à tenir à jour si `FORMATIONS` change.
