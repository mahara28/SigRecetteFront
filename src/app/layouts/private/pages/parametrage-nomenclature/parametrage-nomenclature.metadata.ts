import { COMMON_TYPES_CODES } from "../../../../app-shared/constantes/Constantes";
import { Icons } from "../../../../app-shared/constantes/Icons";

export const NomenclatureMetadata = {
  nomenclatureListTableMetadata: {
    ref: 'TableNomenclature',
    title: 'gestNomenclature.table.title', // clé de traduction
    hasPagination: true,
    hasAdd: false,
    hasFilter: true,
    hasExport: true,
    hasImprime: false,
    columns: [
      {
        label: 'gestNomenclature.table.columns.login',
        key: 'nomTable',
        style: {
          width: '25%',
          padding: '0 5px',
        },
        export: {
          width: '25%',
        },
      },
      {
        label: 'gestNomenclature.table.columns.Désignation',
        key: { fr: 'codeLibe', en: 'codeLibe' }, // si tu veux gérer FR/EN
        style: {
          width: '50%',
          padding: '0 5px',
        },
        export: {
          width: '50%',
        },
      },
      {
        label: 'gestNomenclature.table.columns.FActif',
        key: 'isActive',
        type: COMMON_TYPES_CODES.BOOLEAN,
        style: {
          width: '15%',
          padding: '0 5px',
          'text-align': 'center',
        },
        export: {
          width: '15%',
          alignment: 'center',
        },
      },
      {
        label: '',
        key: 'actions',
        type: COMMON_TYPES_CODES.ACTIONS,
        sortable: false,
        style: {
          'text-align': 'center',
          width: '10%',
          padding: '0 5px',
        },
        btns: [Icons.edit, Icons.delete],
      },
    ],
  },
  filterNomenclatureMetadata: {
    labels: {
      nomTable: 'gestNomenclature.form.labels.code',
      codeLibe: 'gestNomenclature.form.labels.desFr',
      ordrAffi: 'gestNomenclature.form.labels.ordrAffi',
      isActive: 'gestNomenclature.form.labels.isActive',
    },
  },
};

export const SelectNomenclatureMetadata = {
  label: 'gestNomenclature.form.labels.desFr',
  optionLabel: 'desFr',
  filter: true,
  tooltip: false,
  reset: true,
  value: 'desFr',
  emitedValue: '—',
  muliple: false,
};
