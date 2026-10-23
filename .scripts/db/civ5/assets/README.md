# Assets fournis localement

CivVAPI publie deux unités uniques sous `specialists/`, et la famille
`specialists` n'expose aucune icône — ce sont les deux seules unités uniques
sans visuel. Ces fichiers comblent ce trou : ils ne viennent pas de CivVAPI et
`pnpm db:images:civ5` ne peut donc pas les reconstruire.

L'arborescence reproduit celle de `bin/assets/images/`, et les fichiers partent
sur R2 avec le reste de l'arbre d'images, à la main comme le reste de l'upload.

| Fichier                              | Entité                           | Source                                                                                                                         |
| ------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `unit_icons/khan.webp`               | `specialists/khan`               | https://static.wikia.nocookie.net/civilization/images/5/50/Khan_%28Civ5%29.png/revision/latest?cb=20210112195535               |
| `unit_icons/merchant_of_venice.webp` | `specialists/merchant_of_venice` | https://static.wikia.nocookie.net/civilization/images/d/d8/Merchant_of_Venice_%28Civ5%29.png/revision/latest?cb=20210112204147 |

Les sources amont sont en PNG ; les copies ici sont converties en WebP, comme
les 684 autres icônes.
