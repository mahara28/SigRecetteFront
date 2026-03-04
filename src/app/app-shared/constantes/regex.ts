
/** Expressions régulières réutilisables dans l’application */
export const regex = {
  url: (): RegExp =>
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g,

  arabicInput: (): RegExp => /^[\u0621-\u064A.0-9-/+*| ]+$/,

  frInput: (): RegExp => /^[a-zA-ZÀ-ÿ-.*-|/0-9 ]*$/,

  caractInput: (): RegExp => /^[a-zA-ZÀ-ÿ \u0621-\u064A\s_]*$/,

  fileName: (): RegExp =>
    /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/,

  schoolYear: (): RegExp => /^\d{4}.\d{4}$/,

  isNumber: (): RegExp => /\d/,

  isMatricule: (): RegExp => /^[0-9]{7}[A-Z]{1}$/,

  isPhoneNumber: (): RegExp => /^\(?[\d]{2}\)?[\s-]?[\d]{3}[\s-]?[\d]{3}$/,

  min8: (): RegExp => /.{8,}/,

  minCode10: (): RegExp => /^[\s\S]{0,11}$/,

  specialChar: (): RegExp => /\W|_/g,

  upperCase: (): RegExp => /[A-Z]/,

  lowerCase: (): RegExp => /[a-z]/,

  email: (): RegExp => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(fr|com|tn)$/,

  cin: (): RegExp => /^[0-9]{8}$/,

  cnss: (): RegExp => /^[0-9]{10}$/,

  matricule: (): RegExp => /^.{1,7}$/,

  month: (): RegExp => /^([\d]|1[0-2])$/,

  yearNum: (): RegExp => /^(19|[2-9][0-9])\d{2}$/,

  passport: (): RegExp => /^([A-Z]|[a-z]|[0-9])*$/,
};
