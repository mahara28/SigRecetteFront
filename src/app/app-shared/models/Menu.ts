/* export interface Menu {
  menuId: string;
  icon: string;
  path?: string;
  tooltip: string;
  title: string;
  externalLink: boolean;
  submenus?: Menu[];
}
 */

/* export interface Menu {
  id: string;
  title: string;
  icon?: string;
  route?: string;
  externalLink: boolean;
  children?: Menu[];
} */

export interface Menu {
  id: string;
  code?: string;
  icon?: string;
  router?: string;
  desFr?: string;
  codeTranslate?: string;
  desEn?: string;
  checked?: number;
  isActive?: number;
  idParent?: string;
  desAr?: string;
  externalLink?: boolean;
  tooltip: string;
  idFonc: string;

  listSousMenu?: Menu[];
}
