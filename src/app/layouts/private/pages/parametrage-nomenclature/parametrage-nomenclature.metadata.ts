import { COMMON_TYPES_CODES } from '../../../../app-shared/constantes/Constantes';
import { Icons } from '../../../../app-shared/constantes/Icons';

export const ParamNomenclatureMetadata = {
  paramNomenclatureListTableMetadata: {
    ref: 'TableParamNomenclature',
    title: 'gestNomenclature.table.title',
    hasPagination: true,
    hasAdd: false,
    hasFilter: true,
    hasExport: false,
    hasImprime: false,
    columns: [
      {
        label: 'gestNomenclature.form.labels.nomTable',
        key: 'nomTable',
        sortable: true,
        style: { width: '30%', padding: '0 5px' },
        export: { width: '30%' },
      },
      {
        label: 'gestNomenclature.form.labels.designation',
        key: 'codeLibe',
        sortable: true,
        style: { width: '45%', padding: '0 5px' },
        export: { width: '45%' },
      },
      {
        label: 'gestNomenclature.form.labels.isActive',
        key: 'isActive',
        type: COMMON_TYPES_CODES.BOOLEAN,
        style: { width: '12%', padding: '0 5px', 'text-align': 'center' },
        export: { width: '12%', alignment: 'center' },
      },
      {
        label: '',
        key: 'actions',
        type: COMMON_TYPES_CODES.ACTIONS,
        sortable: false,
        style: { width: '13%', 'text-align': 'center', padding: '0 5px' },
        // Icons.view déclenche onViewNomenclatureData() via le dispatcher onAction
        btns: [Icons.details],
      },
    ],
  },

  filterNomenclatureMetadata: {
    labels: {
      nomTable: 'gestNomenclature.form.labels.nomTable',
      codeLibe: 'gestNomenclature.form.labels.designation',
      isActive: 'gestNomenclature.form.labels.isActive',
    },
  },
};

export const SelectNomenclatureMetadata = {
  label: "gestNomenclature.form.labels.nomTable",
  optionLabel: "nomTable",
  filter: true,
  tooltip: false,
  reset: true,
  value: "nomTable",
  emitedValue: "—",
  muliple: false,
};
export const ListeNomenclatureMetadata = {
  nomenclatureListTableMetadata: {
    ref: 'TableNomenclatureData',
    title: 'gestNomenclature.data.table.title',
    hasPagination: true,
    hasAdd: true,
    hasFilter: true,
    hasExport: true,
    hasImprime: false,
    columns: [
      {
        label: 'gestNomenclature.data.columns.code',
        key: 'code',
        sortable: true,
        style: { width: '12%', padding: '0 5px' },
        export: { width: '12%' },
      },
      {
        label: 'gestNomenclature.data.columns.codeLibe',
        key: 'codeLibe',
        sortable: true,
        style: { width: '35%', padding: '0 5px' },
        export: { width: '35%' },
      },
      {
        label: 'gestNomenclature.data.columns.codeLiAr',
        key: 'codeLiAr',
        sortable: true,
        style: { width: '30%', padding: '0 5px' },
        export: { width: '30%' },
      },
      {
        label: 'gestNomenclature.data.columns.ordrAffi',
        key: 'ordrAffi',
        sortable: true,
        style: { width: '10%', padding: '0 5px', 'text-align': 'center' },
        export: { width: '10%', alignment: 'center' },
      },
      {
        label: 'gestNomenclature.data.columns.isActive',
        key: 'isActive',
        style: { width: '8%', padding: '0 5px', 'text-align': 'center' },
        export: { width: '8%', alignment: 'center' },
      },
      {
        label: '',
        key: 'actions',
        type: COMMON_TYPES_CODES.ACTIONS,
        sortable: false,
        style: { width: '5%', 'text-align': 'center', padding: '0 5px' },
        btns: [Icons.edit, Icons.delete],
      },
    ],
  },

  filtreListNomenclatureDataMetadata: {
    labels: {
      code: 'gestNomenclature.data.columns.code',
      codeLibe: 'gestNomenclature.data.columns.codeLibe',
      ordrAffi: 'gestNomenclature.data.columns.ordrAffi',
      isActive: 'gestNomenclature.data.columns.isActive',
    },
  },
};

export const NomenclatureAddMetadata = {
  title: 'gestNomenclature.add_nom',
  labels: {
    code: 'gestNomenclature.nomenclature.column.code',
    codeLibe: 'gestNomenclature.nomenclature.column.codeLibe',
    ordrAffi: 'gestNomenclature.nomenclature.column.ordrAffi',
    isActive: 'gestNomenclature.nomenclature.column.isActive',
  },
};