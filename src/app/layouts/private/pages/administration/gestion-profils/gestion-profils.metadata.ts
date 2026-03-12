import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { COMMON_TYPES_CODES } from '../../../../../app-shared/constantes/Constantes';
import { Icons } from '../../../../../app-shared/constantes/Icons';

export function maxLengthWithCustomMessage(maxLength: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (value && value.length > maxLength) {
      return { maxlength: message };
    }

    return null;
  };
}

export const FicheListeProfilsMetadata = {
  tableListProfilsMetadata: {
    ref: 'TableGestionProfils',
    title: 'profil.table.title',
    hasPagination: true, // true | false, default: true
    hasAdd: true,
    hasFilter: true,
    hasExport: true,
    columns: [
      {
        label: 'profil.table.columns.login',
        key: 'code',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
      },
      {
        label: 'profil.table.columns.Désignation',
        key: 'desFr',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
      },
      {
        label: 'profil.table.columns.FActif',
        key: 'isActive',
        style: {
          width: '10%',
          padding: '0 5px',
          'text-align': 'left',
        },
        export: {
          width: '20%',
        },
      },

      // {
      //     label: 'administration.gu.ficheListUtilisateurs.table.columns.desUserEtat',
      //     key: {
      //         fr: 'desFrUserEtat',
      //         en: 'desArUserEtat'
      //     },
      //     style: {
      //         "text-align": "center",
      //         "width": "15%",
      //         "padding": "0 5px",
      //     },
      //     export: {
      //         width: '15%',
      //         alignment: 'center'
      //     }
      // },
      {
        label: '',
        key: 'actions',
        type: COMMON_TYPES_CODES.ACTIONS,
        sortable: false,
        style: {
          'text-align': 'center',
          width: '7%',
          padding: '0 5px',
        },
        btns: [Icons.details, Icons.edit, Icons.delete],
      },
    ],
  },
  filtreListProfilsMetadata: {
    labels: {
      codProfil: 'profil.table.columns.login',
      desProfil: 'profil.table.columns.Désignation',
    },
  },
};
export const FicheAjoutEditProfil = {
  labels: {
    code: 'administration.gp.ficheAddprofil.form.labels.code',
    desFr: 'administration.gp.ficheAddprofil.form.labels.desFr',
    desEn: 'administration.gp.ficheAddprofil.form.labels.desEn',
    isActive: 'administration.gp.ficheAddprofil.form.labels.isActive',
  },
};

export const FicheDetailsProfil = {
  detailsProfilMetadata: {
    ref: 'ficheDetailsProfils',
    title: 'administration.gp.fichedetailProfil.detail',
    columns: [
      {
        label: 'profil.table.columns.login',
        key: 'code',
      },
      {
        label: 'profil.table.columns.Désignation',
        key: {
          fr: 'desFr',
          en: 'desEn',
        },
      },

      {
        label: 'profil.table.columns.FActif',
        key: 'isActive',
      },
    ],
  },
};
