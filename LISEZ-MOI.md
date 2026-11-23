# DEKOUWAYE – Site web

Site statique (HTML, CSS, JavaScript) : aucune installation, aucun serveur à configurer.

## Contenu du dossier
- `index.html` : accueil (recherche, annonces, quartiers…)
- `recherche.html` : recherche avec filtres (lieu, type, prix, tri)
- `logement.html` : détail d'un logement (galerie, contact, favoris)
- `favoris.html`, `publier.html` (6 étapes), `a-propos.html`, `contact.html`, `connexion.html`
- `css/style.css` : couleurs et mise en page (couleurs en haut du fichier : `--navy`, `--orange`)
- `js/data.js` : **la liste des logements** (c'est ici que vous ajoutez/modifiez vos annonces)
- `js/app.js` : le fonctionnement du site
- `assets/` : logos et images

## 1. Ouvrir dans VS Code et tester
1. Décompressez le zip, puis VS Code > Fichier > Ouvrir le dossier… > choisissez `dekouwaye-site`.
2. Installez l'extension **Live Server** (icône des extensions à gauche, cherchez « Live Server », Ritwick Dey).
3. Clic droit sur `index.html` > **Open with Live Server**. Le site s'ouvre dans votre navigateur et se
   rafraîchit à chaque Ctrl + S.

## 2. Mettre le site en ligne (gratuit)

### Option A – Netlify (la plus simple, sans compte GitHub)
1. Créez un compte sur https://app.netlify.com
2. Allez sur https://app.netlify.com/drop
3. **Glissez le dossier `dekouwaye-site`** dans la page. Votre site est en ligne en quelques secondes,
   avec une adresse du type `https://nom-aleatoire.netlify.app`.
4. Pour changer le nom : Site configuration > Change site name.
5. Pour mettre à jour : refaites le glisser-déposer (Deploys > glissez de nouveau le dossier).

### Option B – GitHub Pages (mises à jour automatiques depuis VS Code)
1. Créez un compte sur https://github.com et un dépôt public nommé `dekouwaye`.
2. Dans VS Code : Contrôle de code source (icône à gauche) > **Initialiser le dépôt** > saisissez un message
   > Commit > **Publier la branche** (connectez-vous à GitHub si demandé).
3. Sur GitHub : Settings > Pages > Source : *Deploy from a branch* > branche `main`, dossier `/ (root)` > Save.
4. Après 1 à 2 minutes : `https://VOTRE-NOM.github.io/dekouwaye/`.
5. Pour mettre à jour : modifiez, Commit, puis Sync dans VS Code.

### Option C – Vercel
Compte sur https://vercel.com > Add New > Project > importez le dépôt GitHub > Deploy.

## 3. Nom de domaine (optionnel)
Pour une adresse comme `dekouwaye.com` ou `dekouwaye.sn` : achetez le domaine chez un bureau d'enregistrement,
puis dans Netlify : Domain management > Add a domain, et suivez les instructions.

## 4. Ajouter ou modifier un logement
Ouvrez `js/data.js`, copiez un bloc `{ id: 1, ... }`, collez-le à la suite, changez le numéro `id`
(unique) et les informations. Pour vos propres photos, mettez-les dans `assets/` et écrivez par exemple
`photos: ['assets/mon-studio-1.jpg']`.

## À savoir
- Les annonces sont **des exemples** ; les photos viennent de Pexels (à remplacer par vos photos réelles).
- Les favoris et les annonces publiées via « Publier une annonce » sont enregistrés **dans le navigateur
  du visiteur** (pas sur un serveur) : les autres visiteurs ne les voient pas. Pour de vraies annonces partagées
  entre utilisateurs, il faudra plus tard une base de données (Firebase ou Supabase).
- Le formulaire de contact n'envoie pas de message ; email, téléphone et réseaux sociaux officiels sont à ajouter
  dans `contact.html` et dans le pied de page (`js/app.js`, fonction `layout`).
