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

export interface Menu {
  id: string;
  title: string;
  icon?: string;
  route?: string;
  children?: Menu[];
}
