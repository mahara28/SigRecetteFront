import { Icons } from './Icons';

export const COMMON_METADATA = {
  select: (metadata: any) => ({
    label: metadata.label ?? '',
    value: metadata.value ?? null,
    optionLabel: metadata.optionLabel ?? {
      fr: 'libelleFr',
      ar: 'libelleAr',
      en: 'libelleEn'
    },
    filter: metadata.filter ?? true,
    tooltip: metadata.tooltip ?? true,
    reset: metadata.reset ?? true,
    multiple: metadata.multiSelect ?? false,
    grouping: metadata.grouping ?? false,
    parentChild: metadata.parentChild ?? false,
    flotParentChild: metadata.flotParentChild ?? false,
    emitedValue: metadata.emitedValue ?? '—'
  }),

  dialogAddEtape: {
    form: {
      controls: [
        { key: 'numEtape', label: 'add_etape_dialog.content.form.labels.numEtape', required: true },
        { key: 'idNmEtatFin', label: 'add_etape_dialog.content.form.labels.idNmEtatFin', required: true },
        { key: 'dtEtat', label: 'add_etape_dialog.content.form.labels.dtEtat', required: true },
        { key: 'txtEtat', label: 'add_etape_dialog.content.form.labels.txtEtat' }
      ]
    }
  },

  dialogAddDoc: {
    form: {
      controls: [
        { key: 'numDoc', label: 'general.add_doc_dialog.content.form.labels.numDoc', required: true, disabled: true },
        { key: 'idNmTypeDoc', label: 'general.add_doc_dialog.content.form.labels.typeDoc', required: true },
        { key: 'nomFichier', label: 'general.add_doc_dialog.content.form.labels.nomFichier', required: true },
        { key: 'observation', label: 'general.add_doc_dialog.content.form.labels.observation' }
      ]
    },

    tableAtachFiles: {
      ref: 'TableAtachFiles',
      title: 'general.add_doc_dialog.content.tableAF.title',
      hasAdd: true,
      hasPagination: true,
      paginationPageSize: 5,
      paginationPageIndex: 0,
      hasExport: false,
      hasFilter: false,
      exportOrientation: 'portrait',
      columns: [
        { label: 'general.add_doc_dialog.content.tableAF.columns.fileNm', key: 'name', style: { padding: '0 5px' } },
        {
          label: '',
          key: 'actions',
          type: 'actions',
          style: { 'text-align': 'center', width: '6%', padding: '0 5px' },
          sortable: false,
          btns: [Icons.download, Icons.delete]
        }
      ]
    }
  },

  tableListDocumentAddEdit: {
    ref: "TableListDocument",
    title: "general.tableListeDocument.title",
    hasAdd: true,
    hasPagination: true,
    paginationPageSize: 5,
    paginationPageIndex: 0,
    exportOrientation: "portrait",
    columns: [
      { label: "general.tableListeDocument.columns.numDoc", key: "numDoc", style: { width: "10%", padding: "0 5px", "text-align": "right" } },
      { label: "general.tableListeDocument.columns.type", key: { fr: "typeDocFr", ar: "typeDocAr", en: "typeDocEn" }, style: { "text-align": "left", width: "20%", padding: "0 5px" } },
      { label: "general.tableListeDocument.columns.nomDoc", key: "nomFichier", style: { padding: "0 5px", "text-align": "left" } },
      { label: "", key: "actions", type: "actions", style: { "text-align": "center", width: "6%", padding: "0 5px" }, sortable: false, btns: [Icons.edit, Icons.delete, Icons.details, Icons.download] }
    ]
  }
};
