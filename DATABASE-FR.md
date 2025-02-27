# Tutoriel base de donnée

Pour ce tuto, j’utilise Scene comme source d’exemple ainsi que le navigateur Google Chrome.

Pour voir la base de données, clique droit puis “inspecter” ou pressez F12. Choisissez Appli dans les onglets du haut.

![appli](src/assets/readme/Appli.png)

Puis dans stockage dépliez base de donnée indexée et vous y trouverez la base de données d’AugCom et ses différentes tables ainsi que leurs données.

![stockage](src/assets/readme/Stockage.png)

Cette base de données si vous décidez de la supprimer du navigateur, cette base de données se reformera automatiquement quand vous rafraichissez la page de l’application AugCom avec les valeurs par défaut, donc vous perdrez tous les autres utilisateurs, grilles etc…

La première chose à faire pour chaque opération sur la base de données est une requête d’ouverture comme la suivante :

```ts
this.openRequest = indexedDB.open('saveVisualSceneDisplay', 3);

      // ERROR
      this.openRequest.onerror = event => {
        alert('Database error: ' + event.target.errorCode);
      };

      // SUCCESS
      this.openRequest.onsuccess = event => {
```

## Ajouter une table à la base de données

Pour ajouter une table il suffit d’utiliser l’event pour cibler la base de donnée puis d’utiliser la fonction createObjectStore() qui est présente dans angular sans package et d’indiquer le nom de la table ici ‘Scene’ et mettre en auto-incrémentation.
```ts
const transaction = event.target.transaction;
```

## Ajouter/modifier/supprimer des données dans une table

Pour ajouter des données dans une table, il faut utiliser l’event pour faire une transaction.
```ts
const db = event.target.result;
db.createObjectStore('Scene', {autoIncrement: true});
```
Ensuite, si on veut ajouter une donnée dans la table il faut utiliser ‘add’ en donnant en argument la donnée, même si ‘put’ marche de la même manière mais il cible une clé (ici le 2ème argument est la clé). Si elle existe, il modifiera le contenu de cette clé, sinon il ajoute une ligne avec la clé et les données.
De la même manière, pour supprimer une ligne il suffit d’utiliser “delete” en donnant comme argument la clé de la donnée à supprimer.
```ts
const scencesStore = transaction.objectStore('Scene');

paletteObjectStore.add(this.SCENES);
paletteObjectStore.put(this.SCENCES, this.userDBService.currentUser);
paletteObjectStore.delete(this.userDBService.currentUser);
```
