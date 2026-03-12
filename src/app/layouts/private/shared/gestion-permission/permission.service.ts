import { inject, Injectable } from '@angular/core';
import { initSearchObject } from '../../../../app-shared/tools';
import { SearchObject, Sort } from '../../../../app-shared/models';
import { Icons } from '../../../../app-shared/constantes/Icons';
import { SessionStorageService } from '../../../../app-shared/services/SessionStorage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private sessionStorage = inject(SessionStorageService);

  /**
   * Retourne un objet metadata adapté aux permissions de l'utilisateur
   * @param selectedMenuKey idFonc actif ou clé du menu
   * @param metadataDefault metadata par défaut (ex: FicheListeProfilsMetadata.tableListProfilsMetadata)
   */
  getMetadataWithPermissions(metadataDefault: any) {
    const idFonc = Number(this.sessionStorage.getItem('selectedMenu'));

    const userStr = localStorage.getItem('userInfo');
    if (!userStr) return null;

    const user = JSON.parse(userStr);

    // Chercher la permission correspondant à ce menu
    const fonction = user.listFonctionPermission.find((f: any) => f.idFonc === idFonc) || {};

    // Permissions
    const canAdd = fonction.isAdd === 1;
    const canUpdate = fonction.isUpdate === 1;
    const canDelete = fonction.isSupp === 1;
    const canDetails = fonction.isDetails === 1;
    const canExport = fonction.isExport === 1;
    const canFilter = fonction.isList === 1;
    const canImprime = fonction.isImprime === 1;

    // Générer les colonnes actions dynamiquement
    const columns = metadataDefault.columns.map((col: any) => {
      if (col.key === 'actions') {
        const btns = [];
        if (canDetails) btns.push(Icons.details);
        if (canUpdate) btns.push(Icons.edit);
        if (canDelete) btns.push(Icons.delete);
        return { ...col, btns };
      }
      return col;
    });

    // Retourner l'objet complet
    return {
      metadata: {
        ...metadataDefault,
        hasAdd: canAdd,
        hasFilter: canFilter,
        hasExport: canExport,
        hasImprime: canImprime,
        columns: columns,
      },
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort(),
      }),
      searchObjectall: new SearchObject(),
    };
  }
}
