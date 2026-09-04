# Design system — Quel designer êtes-vous ?

Conventions visuelles établies au fil du projet. Ce fichier documente ce qui existe déjà — le compléter à chaque nouveau pattern stabilisé, ne pas réinventer un token qui existe déjà sous un autre nom.

## Couleurs (tokens CSS, `:root`)

```css
--ink: #111111;        /* texte principal */
--ink-soft: #666666;   /* texte secondaire — corrigé pour contraste WCAG AA (5.2:1), ne jamais repasser en #888 ou plus clair */
--bg: #f5f5f3;         /* fond de page */
--card: #ffffff;       /* fond des cards — attention, doit être défini dans :root sinon les cards héritent du fond de page sans contraste (bug déjà rencontré) */
--white: #ffffff;
--border: #e2e2de;
--fill: #111111;
--fill-dim: #e0e0dc;
--fill-done: #c8c8c4;
--radius: 14px;
--red: #d32f2f;
--green: #1b6b2e;
--avatar-bg: #ece8e0;
```

Toujours ajouter une nouvelle variable dans `:root` avant de l'utiliser ailleurs — un `var(--xxx)` sur une variable jamais définie ne provoque pas d'erreur visible, juste un rendu silencieusement cassé.

## Typographie

- **Titres** (`h1`, `h2`, `.screen-h2`) : `Georgia, serif`, gras
- **Corps** : `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif` (défini sur `body`)
- Titres d'écran type "Compétences", "Mon profil" : `font-size: 1.4rem`, `font-weight: 800`
- Labels de section (petites majuscules type "DERNIER BILAN", "FORMATIONS · 1 JOURNÉE") : `font-size: 0.72rem`, `letter-spacing: .06em`, `text-transform: uppercase`, `color: var(--ink-soft)`

## Espacement

- **Gap entre cards du même groupe (formations, ateliers, positionnement)** : `12px`, toujours. Ne pas utiliser d'autres valeurs (16px, 20px) sous peine d'incohérence visuelle — déjà corrigé une fois.
- Un label de section entre deux groupes de cards (ex. "Formations" → "Ateliers") ajoute naturellement un peu plus d'espace (marge du label + sa hauteur) — c'est normal, pas une incohérence à corriger.
- Padding standard des écrans (`.padtop`) : `70px` en haut (pour dégager la topbar fixe)

## Grilles de cards

- `.skills-grid-2` : 2 colonnes égales (`1fr 1fr`), `gap: 12px`, passe à 1 colonne sous 540px
- Bloc positionnement (Card avatar + Dernier bilan) : ratio **1fr / 2fr** (1/3 - 2/3), Card alignée à droite de sa colonne (`justify-content: flex-end`)

## Composants récurrents

- **Modal** : `.modal-overlay` (fond semi-transparent, `opacity`/`pointer-events` togglés via classe `.open`) + `.modal-box` (fond blanc, `border-radius: 20px`, `max-width: 320px` par défaut — élargir au cas par cas via un sélecteur dédié comme `#bilanGratuitModal .modal-box`)
- **Sidebar item** : `.sidebar-item`, bouton pleine largeur, icône SVG 16×16 + libellé, état actif = `.active` (fond `--fill-dim`)
- **Card formation/atelier** : `.skills-formation-card` / `.skills-workshop-card`, tag de type en pill coloré (`.skills-type-tag.formation` bleu clair, `.skills-type-tag.workshop` violet clair) — toujours garder ces deux types visuellement alignés (même structure de tag), ne pas laisser l'un en texte simple et l'autre en pill
- **Bandeau intervenant** (`.card-band`, en tête de chaque card formation/atelier) : avatar 32px (photo réelle si dispo dans `INTERVENANT_PHOTOS`, sinon rond coloré à initiales via `INTERVENANT_COLORS`) + nom/titre. Données dans `INTERVENANTS` (objet clé → `{name, titre, photo}`), liées à chaque entrée `FORMATIONS` via son champ `intervenant`. Le rendu passe par la fonction partagée `intervenantBandHtml(f)` — ne pas dupliquer ce markup, toujours passer par `makeFormationCardHtml`/`makeWorkshopCardHtml`.
- **Toast de confirmation** : fond `var(--ink)`, texte blanc, `border-radius: 12px`, positionné `fixed` en bas centré — un toast dédié par usage (ex. `#toast` pour undo suppression, `#bookmarkToast` pour favoris) pour éviter qu'un toast en écrase un autre

## Thème sombre

Pas de dark mode global implémenté (seulement 2-3 règles ponctuelles historiques sur des éléments isolés). Ne pas supposer qu'un composant existant gère le dark mode sans vérifier.

## Interactions

- Transitions globales sur boutons/cards/liens : `background-color`, `border-color`, `color`, `opacity`, `transform`, `box-shadow` en `.18s ease` (défini une fois en haut du fichier, pas besoin de le répéter par composant)
- Changement d'écran : animation de fondu `screenFadeIn` (`.3s ease`) sur `.screen.active`
- Respect systématique de `prefers-reduced-motion` (règle globale qui réduit toutes les durées à `.001ms`)
