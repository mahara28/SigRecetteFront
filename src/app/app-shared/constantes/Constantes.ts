// ################################################
// # Types Codes
// ################################################
export const COMMON_TYPES_CODES = {
  TEXT: 'text',
  TEXT_MULTILIGNE: 'text-multiligne',
  DATE: 'date',
  DATETIME: 'datetime',
  MYDATE: 'mydate',
  TIME: 'time',
  HOURS_TIME: 'hours-time',
  MONTANT: 'montant',
  OTHER: 'other',
  ACTIONS: 'actions',
  COMBINED: 'combined',
  STRICT_COMBINED: 'strict-combined',
  HAS_CHECKBOX: 'has-checkbox',
  HAS_RADIO_BTN: 'has-radio-btn',
  HAS_IMAGE: 'has-image',
  TEXT_FIELD_INPUT: 'text-field-input',
  SELECT_DATE_INPUT: 'select_date_input',
  SELECT_DATE_RANGE: 'select_date_range',
  SELECT_INPUT: 'select_input',
  SELECT_DATE_MY_INPUT: 'select_date_my_input',
  PARAGRAPH: 'paragraph',
  BOOLEAN: 'boolean',
  BOOLEAN_TYPE_JAVA: 'BOOLEAN',
  ICON: 'icon',
  LABEL: 'label',
} as const;

// ################################################
// # Test Types Codes
// ################################################
export const COMMON_TEST_TYPE_CODES = {
  CONTROL_VALUE: 'control-value',
  CONSTANTE_VALUE: 'constante-value'
} as const;

// ################################################
// # Export Types Codes
// ################################################
export const EXPORT_TYPES_CODES = {
  PDF: {
    LABEL: 'PDF',
    CODE: 'pdf',
    EXTENTION: '.pdf'
  },
  EXCEL: {
    LABEL: 'EXCEL',
    CODE: 'excel',
    EXTENTION: '.xlsx'
  }
} as const;

// ################################################
// # Export Direction
// ################################################
export enum DIRECTION {
  LTR = 'ltr',
  RTL = 'rtl'
}

// ################################################
// # Request Special Case
// ################################################
export const REQUEST_SPE_CASE = {
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  DOWNLOAD_PROGRESS: 'download-progress'
} as const;

// ################################################
// # Button Types
// ################################################
export const BTN_TYPES = {
  BTN_ICON: 'icon',
  BTN_FLAT: 'flat',
} as const;

// ################################################
// # Date Formats
// ################################################
export const DATE_FORMATS = {
  DD_MM_YYYY_HH_mm: 'DD/MM/YYYY HH:mm',
  MM_DD_YYYY_HH_mm: 'MM/DD/YYYY HH:mm',
  MM_DD_YYYY: 'MM/DD/YYYY',
  DD_MM_YYYY: 'DD/MM/YYYY',
  HH_mm: 'HH:mm',
  HH_MM_SS: 'HH:mm:ss',
} as const;

// ################################################
// # Candidate State
// ################################################
export const CANDIDATE_STATE = {
  NOTE: '002',
  PRINCIPALE: '003',
  EN_ATTENTE: '004',
  REFUDED: '006',
  ACCEPTED: '005',
  SUSPENDUS: '008',
  ATTENTE_FINAL: '010',
  PRINCIPALE_TRAINING: '011',
  ATTENTE_TRAINING_IEJ: '009',
  PRINCIPALE_BP: '012',
  ATTENTE_BP: '013',
} as const;

// ################################################
// # Etat Demande Inscription
// ################################################
export const DEMANDE_ETAT = {
  EN_ATTENTE: 1,
  ACCEPTED: 2,
  REFUDED: 3,
} as const;


// ################################################
// # Aggregation Codes
// ################################################
export const CODE_AGG_LIKE = 'like';
export const CODE_AGG_UPPER_LIKE = 'upper_like';
export const CODE_AGG_EQUAL = '==';
export const CODE_AGG_DIFFERENCE = '!=';
export const CODE_AGG_BEETWEEN = 'beetween';
export const CODE_AGG_IN = 'in';
export const CODE_AGG_GREAT_OR_EQUAL = '>=';
export const CODE_AGG_LESS_OR_EQUAL = '<=';
