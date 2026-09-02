# JaFood Professional V2

Deuxième version du site JaFood : menu professionnel en anglais par défaut, traduction française instantanée, produits classés dans leur catégorie exacte et réservation en ligne prête à connecter.

## Ouvrir le site

Double-cliquez sur `index.html`. Aucun logiciel ni serveur n'est nécessaire.

## Organisation du menu

Les produits sont classés dans huit catégories :

1. Breakfast & Brunch
2. Cold Mezze
3. Hot Mezze
4. Grills & Mains
5. Sandwiches
6. Desserts
7. Fresh Juices
8. Hot Drinks

Exemple : **Fresh Orange Juice** se trouve dans la section **Fresh Juices** et non dans une catégorie générale.

## Ajouter un produit dans la bonne catégorie

1. Ouvrez `index.html` dans Visual Studio Code.
2. Recherchez la catégorie voulue, par exemple `id="fresh-juices"`.
3. Copiez un bloc `<article class="menu-product">` complet à l'intérieur de cette catégorie.
4. Modifiez le nom anglais, le nom français, les descriptions et le prix.

Exemple simple :

```html
<article class="menu-product" data-menu-product>
  <div class="menu-product__copy">
    <div class="menu-product__title">
      <h4 data-en="Apple Juice" data-fr="Jus de pomme">Apple Juice</h4>
    </div>
    <p
      data-en="Fresh apples pressed to order."
      data-fr="Pommes fraîches pressées à la minute."
    >Fresh apples pressed to order.</p>
  </div>
  <strong class="menu-product__price">$5</strong>
</article>
```

## Ajouter une photo à un produit

1. Placez l'image dans `assets/images/`.
2. Ajoutez la classe `menu-product--photo` à l'article.
3. Ajoutez l'image juste après l'ouverture de l'article :

```html
<article class="menu-product menu-product--photo" data-menu-product>
  <img
    src="assets/images/apple-juice.jpg"
    alt="Fresh apple juice"
    data-alt-en="Fresh apple juice"
    data-alt-fr="Jus de pomme frais"
    loading="lazy"
  />
  <!-- Le nom, la description et le prix restent ici -->
</article>
```

## Ajouter une nouvelle catégorie

Copiez une section complète `<section class="menu-category">` et donnez-lui un nouvel `id`. Ajoutez ensuite un lien identique dans `category-nav` avec le même nom dans `data-category-link`.

## Modifier les traductions

- `data-en` contient le texte anglais affiché par défaut.
- `data-fr` contient sa traduction française.

Le bouton `EN / FR` traduit toute la page et mémorise le choix du visiteur.

## Activer les réservations réelles

Ouvrez `script.js` et modifiez `RESERVATION_CONFIG`.

### Avec Formspree

```js
const RESERVATION_CONFIG = {
  endpoint: "https://formspree.io/f/votre-identifiant",
  whatsapp: "",
};
```

### Avec WhatsApp

Utilisez le numéro international sans `+`, espaces ou tirets :

```js
const RESERVATION_CONFIG = {
  endpoint: "",
  whatsapp: "961XXXXXXXX",
};
```

Si les deux valeurs restent vides, le formulaire fonctionne en mode démonstration et sauvegarde uniquement les demandes sur l'appareil utilisé.

## Publication sur GitHub Pages

1. Ajoutez tous les fichiers dans un dépôt GitHub.
2. Ouvrez **Settings → Pages**.
3. Choisissez **Deploy from a branch**, puis `main` et `/root`.
4. Enregistrez pour recevoir l'adresse publique du site.

## Fichiers principaux

- `index.html` : catégories, produits, contenus et traductions.
- `styles.css` : design responsive et version imprimable.
- `script.js` : langues, navigation, animation et réservation.
- `assets/images/` : photos du restaurant et des produits.
