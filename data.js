/* DEKOUWAYE – annonces de démonstration.
   Pour ajouter un logement : copiez un bloc { ... }, changez l'id (numéro unique) et les informations.
   Photos : remplacez les liens par vos propres images (ex. "assets/mon-photo.jpg"). */
const px = (id, w) => 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + (w || 900);

const LOGEMENTS = [
  { id: 1, type: 'Appartement', titre: 'Appartement lumineux aux Almadies', quartier: 'Almadies', ville: 'Dakar',
    prix: 350000, chambres: 2, surface: 92, meuble: true, dispo: true,
    equip: ['Cuisine équipée', 'Balcon'],
    desc: 'Un appartement lumineux aux volumes confortables, pensé pour une vie quotidienne agréable.',
    photos: [px(1918291), px(271618), px(1910472)] },
  { id: 2, type: 'Studio', titre: 'Studio confortable à Mermoz', quartier: 'Mermoz', ville: 'Dakar',
    prix: 175000, chambres: 1, surface: 38, meuble: true, dispo: true,
    equip: ['Coin cuisine', 'Salle d’eau'],
    desc: 'Un espace fonctionnel et accueillant pour s’installer simplement.',
    photos: [px(6782426), px(6447377)] },
  { id: 3, type: 'Maison', titre: 'Maison familiale avec jardin', quartier: 'Ouakam', ville: 'Dakar',
    prix: 450000, chambres: 3, surface: 150, meuble: false, dispo: true,
    equip: ['Jardin', 'Terrasse'],
    desc: 'Une maison spacieuse offrant de la place pour les moments partagés.',
    photos: [px(34277690)] },
  { id: 4, type: 'Chambre', titre: 'Chambre pratique à Liberté 6', quartier: 'Liberté 6', ville: 'Dakar',
    prix: 85000, chambres: 1, surface: 18, meuble: true, dispo: true,
    equip: ['Rangements'],
    desc: 'Une chambre simple et pratique pour votre quotidien.',
    photos: [px(1743229)] },
  { id: 5, type: 'Appartement', titre: 'Appartement contemporain aux Parcelles', quartier: 'Parcelles Assainies', ville: 'Dakar',
    prix: 240000, chambres: 2, surface: 76, meuble: false, dispo: true,
    equip: ['Cuisine', 'Séjour'],
    desc: 'Un appartement facile à aménager selon vos envies.',
    photos: [px(2724749)] },
  { id: 6, type: 'Studio', titre: 'Studio paisible à Guédiawaye', quartier: 'Guédiawaye', ville: 'Dakar',
    prix: 120000, chambres: 1, surface: 32, meuble: false, dispo: false,
    equip: ['Séjour', 'Coin cuisine'],
    desc: 'Un studio compact avec les espaces essentiels.',
    photos: [px(2029731)] }
];

const QUARTIERS = [
  ['Dakar', px(18189724, 600)], ['Almadies', px(13034805, 600)], ['Mermoz', px(30845464, 600)], ['Liberté 6', px(2119713, 600)],
  ['Ouakam', px(17091309, 600)], ['Parcelles Assainies', px(15010364, 600)], ['Pikine', px(33052786, 600)], ['Guédiawaye', px(34450808, 600)]
];
const CATEGORIES = [['Chambre', 'Chambres', px(271624, 700)], ['Studio', 'Studios', px(1571468, 700)], ['Appartement', 'Appartements', px(323780, 700)], ['Maison', 'Maisons', px(186077, 700)]];
