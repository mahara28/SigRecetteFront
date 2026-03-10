// datatable.utils.ts
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { AppTranslateService } from '../../services/translate/translate.service';
import { isEmptyValue } from './functions.utils';
import { DIRECTION } from '../../constantes/Constantes';
import { DateFormatheurePipe, DateFormatPipe, MontantPipe } from '../../pipes';
import { SearchObject } from '../../models/SearchObject';
import { Pagination } from '../../models/Pagination';
import { Sort } from '../../models/Sort';


/**
 * Interface pour les colonnes de métadonnées
 */
export interface MetadataColumn {
  key: string | Record<string, string>;
  label: string;
  type?: 'date' | 'datetime' | 'montant' | 'text' | 'actions';
  sortable?: boolean;
  export?: {
    key?: string | Record<string, string>;
    width?: string | number;
    alignment?: string | Record<string, 'left' | 'right' | 'center'>;
  };
}

/**
 * Interface pour les colonnes exportées
 */
export interface ExportedColumns {
  cols: string[];
  labels: string[];
  types: string[];
  widths: (string | number)[];
  alignments: string[];
}

/**
 * Interface pour les colonnes spécifiques
 */
export interface SpecificColumns {
  montant: string[];
  date: string[];
  datetime: string[];
  others: string[];
  actions: string[];
  all: string[];
  sortable: string[];
}

/**
 * Interface pour les détails du tableau
 */
export interface TableDetails {
  displayedColumns: string[];
  labels: Record<string, string>;
  specificColumns: SpecificColumns;
  exportedColumns: ExportedColumns;
}

/**
 * Interface pour le résultat du filtrage
 */
export interface FilterResult {
  data: any[];
  total: number;
}

/**
 * Interface pour le tri
 */
export interface SortConfig {
  nameCol: string;
  direction: 'ASC' | 'DESC' | string;
}

/**
 * Initialise les détails du tableau de données
 */
// Initialise les détails du tableau de données
export function initDatatableDetails(
  metadataColumns: MetadataColumn[],
  appTranslateService: AppTranslateService
): TableDetails {
  const displayedColumns: string[] = [];
  const labels: Record<string, string> = {};
  const specificColumns: SpecificColumns = {
    montant: [],
    date: [],
    datetime: [],
    others: [],
    actions: [],
    all: [],
    sortable: []
  };

  const exportedColumns: ExportedColumns = {
    cols: [],
    labels: [],
    types: [],
    widths: [],
    alignments: []
  };

  const currentLang = appTranslateService.getCurrentLanguage();
  const dir = appTranslateService.getCurrentDirection();

  for (const col of metadataColumns) {
    // Récupération de la clé de colonne
    const colKey = typeof col.key === 'object'
      ? col.key[currentLang]
      : col.key;

    displayedColumns.push(colKey);
    labels[colKey] = col.label;

    // Gestion du tri
    if (col.sortable !== false) {
      specificColumns.sortable.push(colKey);
    }

    // Gestion des types spécifiques - CORRECTION ICI
    if (col.type) {
      // Vérifier si le type existe dans specificColumns
      switch (col.type) {
        case 'montant':
          specificColumns.montant.push(colKey);
          break;
        case 'date':
          specificColumns.date.push(colKey);
          break;
        case 'datetime':
          specificColumns.datetime.push(colKey);
          break;
        case 'actions':
          specificColumns.actions.push(colKey);
          break;
        default:
          specificColumns.others.push(colKey);
          break;
      }
      specificColumns.all.push(colKey);
    }

    // Gestion de l'export
    if (col.export) {
      const exportKey = col.export.key
        ? (typeof col.export.key === 'object'
            ? col.export.key[currentLang]
            : col.export.key)
        : colKey;

      exportedColumns.cols.push(exportKey);
      exportedColumns.labels.push(col.label);
      exportedColumns.types.push(col.type || 'text');
      exportedColumns.widths.push(col.export.width || 'auto');

      // Gestion de l'alignement
      if (col.export.alignment) {
        const alignment = typeof col.export.alignment === 'object'
          ? col.export.alignment[dir]
          : col.export.alignment;
        exportedColumns.alignments.push(alignment);
      } else {
        exportedColumns.alignments.push(dir === DIRECTION.RTL ? 'right' : 'left');
      }
    }
  }

  return {
    displayedColumns,
    labels,
    specificColumns,
    exportedColumns
  };
}

/**
 * Initialise les colonnes exportées
 */
export function initExportedColumns(
  metadataColumns: MetadataColumn[],
  appTranslateService: AppTranslateService
): ExportedColumns {
  const exportedColumns: ExportedColumns = {
    cols: [],
    labels: [],
    types: [],
    widths: [],
    alignments: []
  };

  const currentLang = appTranslateService.getCurrentLanguage();
  const dir = appTranslateService.getCurrentDirection();

  for (const col of metadataColumns) {
    if (!isEmptyValue(col.export)) {
      const colKey = typeof col.key === 'object'
        ? col.key[currentLang]
        : col.key;

      const exportKey = col.export?.key
        ? (typeof col.export.key === 'object'
            ? col.export.key[currentLang]
            : col.export.key)
        : colKey;

      exportedColumns.cols.push(exportKey);
      exportedColumns.labels.push(col.label);
      exportedColumns.types.push(col.type || 'text');
      exportedColumns.widths.push(col.export?.width || 'auto');

      // Gestion de l'alignement
      let alignment: string = dir === DIRECTION.RTL ? 'right' : 'left';
      if (col.export?.alignment) {
        alignment = typeof col.export.alignment === 'object'
          ? col.export.alignment[dir]
          : col.export.alignment;
      }
      exportedColumns.alignments.push(alignment);
    }
  }

  return exportedColumns;
}

/**
 * Vérifie si une valeur correspond au texte tapé
 */
const checkValue = (value: any, typedValue: string): boolean => {
  if (isEmptyValue(value)) return false;
  return value.toString().toLowerCase().trim()
    .includes(typedValue.toLowerCase().trim());
};

/**
 * Filtre les données du tableau (version 1)
 */
export function doFilter(
  typedValue: string,
  tableDetails: TableDetails,
  listData: any[]
): FilterResult | undefined {
  console.assert(
    !!tableDetails.displayedColumns,
    'Erreur: tableDetails.displayedColumns doit être défini'
  );
  console.assert(
    !!tableDetails.specificColumns,
    'Erreur: tableDetails.specificColumns doit être défini'
  );

  if (!typedValue?.trim() || !listData?.length) {
    return;
  }

  const datePipe = new DateFormatPipe();
  const dateHeurePipe = new DateFormatheurePipe();
  const filteredData = listData.filter(item => {
    for (const [key, value] of Object.entries(item)) {
      if (tableDetails.displayedColumns.includes(key)) {
        if (tableDetails.specificColumns.date?.includes(key)) {
          if (checkValue(datePipe.transform(value), typedValue)) {
            return true;
          }
        } else if (tableDetails.specificColumns.datetime?.includes(key)) {
          if (checkValue(dateHeurePipe.transform(value), typedValue)) {
            return true;
          }
        } else {
          if (checkValue(value, typedValue)) {
            return true;
          }
        }
      }
    }
    return false;
  });

  return {
    data: filteredData,
    total: filteredData.length
  };
}

/**
 * Récupère la clé d'une colonne
 */
export const getColumnKey = (
  column: string | Record<string, string>,
  appTranslateService: AppTranslateService
): string => {
  if (typeof column === 'object') {
    return column[appTranslateService.getCurrentLanguage()] || '';
  }
  return column;
};

/**
 * Filtre les données du tableau (version 2 avec pipes)
 */
export function doFilterV2(
  typedValue: string,
  listData: any[],
  displayedColumns: string[],
  specificColumns: SpecificColumns,
  ats: AppTranslateService,
  dfp: DateFormatPipe,
  dhfp: DateFormatheurePipe,
  mp: MontantPipe
): FilterResult | undefined {
  if (isEmptyValue(typedValue) || isEmptyValue(listData)) {
    return;
  }

  const filteredData = listData.filter(item => {
    for (const [key, value] of Object.entries(item)) {
      if (displayedColumns.includes(key)) {
        if (specificColumns.date?.includes(key)) {
          if (checkValue(dfp.transform(value), typedValue)) {
            return true;
          }
        } else if (specificColumns.datetime?.includes(key)) {
          if (checkValue(dhfp.transform(value), typedValue)) {
            return true;
          }
        } else if (specificColumns.montant?.includes(key)) {
          if (checkValue(mp.transform(value), typedValue)) {
            return true;
          }
        } else {
          if (checkValue(value, typedValue)) {
            return true;
          }
        }
      }
    }
    return false;
  });

  return {
    data: filteredData,
    total: filteredData.length
  };
}

/**
 * Gère les actions sur les boutons
 */
export function onAction(
  self: any,
  actionBtn: {
    handler: string;
    row?: { item: any; index: number }
  }
): void {
  if (actionBtn.row) {
    if (!isEmptyValue(actionBtn.row)) {
      self[actionBtn.handler](actionBtn.row);
    } else {
      self[actionBtn.handler](actionBtn.row.item);
    }
  } else {
    self[actionBtn.handler]();
  }
}

/**
 * Convertit un fichier en Blob
 */
async function fileToBlob(file: File): Promise<Blob> {
  return new Blob([await file.arrayBuffer()], { type: file.type });
}

/**
 * Télécharge un Blob
 */
export function downloadBlob(fileUrl: string, name: string = 'file.txt'): void {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = name;

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

  setTimeout(() => {
    window.URL.revokeObjectURL(fileUrl);
    link.remove();
  }, 100);
}

/**
 * Télécharge un fichier local
 */
export function downloadLocalFile(file: File): void {
  fileToBlob(file).then(blobFile => {
    downloadBlob(window.URL.createObjectURL(blobFile), file.name);
  });
}

/**
 * Télécharge une liste de fichiers sous forme d'archive ZIP
 */
export async function downloadZip(
  filesList: File[],
  fileName: string = 'combined'
): Promise<void> {
  if (!filesList?.length) return;

  try {
    const blobsList = await Promise.all(
      filesList.map(file => fileToBlob(file))
    );

    const zip = new JSZip();
    blobsList.forEach((blob, index) => {
      zip.file(filesList[index].name, blob);
    });

    const zipFile = await zip.generateAsync({ type: 'blob' });
    const datePipe = new DatePipe('en-US');
    const currentDate = datePipe.transform(new Date(), 'yyyyMMdd') || '';
    const finalFileName = `${isEmptyValue(fileName) ? 'combined' : fileName}-${currentDate}.zip`;

    FileSaver.saveAs(zipFile, finalFileName);
  } catch (error) {
    console.error('Erreur lors de la création du ZIP:', error);
  }
}

/**
 * Trie les données du tableau
 */
export function datatableSorting(list: any[], sort: SortConfig): any[] {
  const direction = sort.direction.toUpperCase();

  return [...list].sort((a, b) => {
    const valA = a[sort.nameCol];
    const valB = b[sort.nameCol];

    if (valA < valB) {
      return direction.includes('ASC') ? -1 : 1;
    }
    if (valA > valB) {
      return direction.includes('ASC') ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Initialise un objet de recherche
 */
export function initSearchObject(searchObject?: SearchObject): SearchObject {
  const tempSearchObject = new SearchObject();

  tempSearchObject.pagination = searchObject?.pagination ?? new Pagination(0, 10);
  tempSearchObject.sort = searchObject?.sort ?? new Sort();
  tempSearchObject.listSort = searchObject?.listSort ?? [];
  tempSearchObject.listCol = searchObject?.listCol ?? [];
  tempSearchObject.dataSearch = searchObject?.dataSearch ?? [];
  tempSearchObject.particularSpecifCondi = searchObject?.particularSpecifCondi ?? '';

  return tempSearchObject;
}
