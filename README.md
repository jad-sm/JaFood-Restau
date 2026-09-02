# JaFood — menu bilingue & réservation

Site vitrine statique, responsive et bilingue (français / anglais) pour le restaurant JaFood à Hamra, Beyrouth.

## Ouvrir le site

Double-cliquez simplement sur `index.html`. Aucun logiciel ni installation n'est nécessaire.

## Ajouter un plat et sa photo

1. Placez votre photo dans `assets/images/` (par exemple `burger-jafood.jpg`).
2. Ouvrez `index.html` dans Visual Studio Code.
3. Recherchez `MENU ITEM 01`.
4. Copiez un bloc `<article class="menu-card …"> … </article>` complet.
5. Modifiez le nom, la description, le prix et la catégorie.
6. Remplacez la zone photo par :

```html
<img
  class="menu-card__media dish-photo"
  src="assets/images/burger-jafood.jpg"
  alt="Burger JaFood"
/>
```

Catégories disponibles dans `data-category` :

- `mezze`
- `grill`
- `sweet`
- `drink`

Pour la traduction, placez le texte français dans `data-fr` et l'anglais dans `data-en` :

```html
<h3 data-fr="Nom français" data-en="English name">Nom français</h3>
```

## Activer les réservations réelles

Ouvrez `script.js` et modifiez les deux premières options dans `RESERVATION_CONFIG`.

### Option 1 — Formspree

Créez un formulaire sur Formspree, puis collez son endpoint :

```js
const RESERVATION_CONFIG = {
  endpoint: "https://formspree.io/f/votre-identifiant",
  whatsapp: "",
};
```

### Option 2 — WhatsApp

Ajoutez le numéro du restaurant avec l'indicatif, sans `+`, espaces ou tirets :

```js
const RESERVATION_CONFIG = {
  endpoint: "",
  whatsapp: "961XXXXXXXX",
};
```

Tant que les deux options sont vides, le formulaire reste en mode démonstration et stocke les demandes uniquement dans le navigateur utilisé.

## Mettre le site sur GitHub Pages

1. Ajoutez tous les fichiers dans un nouveau dépôt GitHub.
2. Dans le dépôt, ouvrez **Settings → Pages**.
3. Choisissez **Deploy from a branch**, puis `main` et `/root`.
4. Enregistrez. GitHub fournira l'adresse publique du site.

## Fichiers principaux

- `index.html` : contenu, plats, traductions et structure.
- `styles.css` : design et adaptation mobile.
- `script.js` : langues, filtres, navigation et réservation.
- `assets/images/` : photographies du site.

Les images fournies avec ce projet ont été créées spécialement pour JaFood.
