// src/app/shared/constants/constante-ws.ts

/** Constantes pour les codes HTTP, microservices et WebServices */
export const ConstanteWs = {
  // ################################################
  // # Protocole HTTP
  // ################################################
  _CODE_GET: 'GET',
  _CODE_POST: 'POST',
  _CODE_PUT: 'PUT',
  _CODE_DELETE: 'DELETE',

  // ################################################
  // # Microservices
  // ################################################
 /*  _CODE_GATEWAY: '',
  _CODE_ADMINISTRATION: 'administration',
  _CODE_NOMENCLATURE: 'nomenclature',
  _CODE_APPLICATION: 'application',
  _CODE_GED: 'ged',
  _CODE_REPORT: 'reporting',
  _CODE_NOTIFICATION: 'notification', */

  // ################################################
  // # WebServices Codes
  // ################################################
  _CODE_WS_SUCCESS: '200',
  _CODE_WS_SUCCESS_WAIT_PERMISSION: '201',
  _CODE_WS_ACCOUNT_EXPIRED: '202',
  _CODE_WS_BAD_REQUEST: '400',
  _CODE_WS_UNAUTHORIZED: '401',
  _CODE_WS_NO_ACCESS: '403',
  _CODE_WS_URI_NOT_FOUND: '404',
  _CODE_WS_METHOD_NOT_ALLOWED: '405',
  _CODE_WS_UNRESOLVED_AUDIENCES: '470',

  _CODE_WS_LOGIN_EXISTS: '411',
  _CODE_WS_CODE_EXISTS: '413',
  _CODE_WS_CODE_NOTIF_SEND: '480',
  _CODE_WS_CODE_NO_NOTIF_SEND: '490',
  _CODE_WS_PHASE_1_EXISTS: '430',
  _CODE_WS_PHASE_2_3_EXISTS: '431',
  _CODE_WS_REF_CONVENTION_EXISTS: '429',
  _CODE_WS_CIN_EXISTS: '434',
  _CODE_WS_MATRICULE_EXISTS: '433',
  _CODE_WS_NUM_CONTRAT_EXISTS: '492',
  _CODE_WS_ERROR_IN_METHOD: '420',
  _CODE_WS_ERROR_ALIAS_PARAM: '421',
  _CODE_WS_ERROR_NOT_EXISTS_ROW_DATA_BASE: '422',
  _CODE_WS_WRONG_PARAM: '423',
  _CODE_WS_ERROR_PROBLEM_DELETE: '424',
  _CODE_WS_ERROR_UNIQUE_CODE: '425',
  _CODE_WS_ERROR_UNIQUE_LIBELLE: '431',
  _CODE_WS_ERROR_IN_EXCEPTION_DATABASE: '669',
  _CODE_WS_ERROR_SAVE_OR_UPDATE: '426',
  _CODE_WS_ERROR_DELETE_ROW: '427',

  _CODE_WS_USER_ERROR_AUTH: '461',
  _CODE_WS_PRB_IN_CONFIRM_PASSWORD: '462',
  _CODE_WS_PORTAL_SESSION_EXPIRED: '465',

  _CODE_WS_ERROR_CONVERT: '499',
  _CODE_WS_ERROR: '500',

  _CODE_WS_ERROR_DUPLICATE_ORDER: '900',
  _CODE_WS_ERROR_DUPLICATE_NUMERO: '901',
  _CODE_WS_ERROR_EMAIL_CODE: '666',
  _CODE_WS_ERROR_IN_COPY_DATA: '777',
  _CODE_CANDIDATE_NOT_FOUND: '450',
  _CODE_CANDIDATE_IN_REPLACEMENT: '460',
  _CODE_CANDIDATE_IN_POINTING: '461',
  _CODE_CANDIDATE_AFFECTED_TO_COACH: '462',

  // ################################################
  // # Langues
  // ################################################
  _LANGUAGE_FR: 'fr',
  _LANGUAGE_AR: 'ar',
  _LANGUAGE_EN: 'en'
} as const;
