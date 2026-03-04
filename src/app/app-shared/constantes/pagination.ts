/** Nombre par défaut d’éléments par page */
const DEFAULT_ITEMS_PER_PAGE = 10;

/**
 * Génère les options de pagination pour un select
 * @param itemsNumber nombre d’items par défaut
 * @returns tableau trié et unique d’options
 */
export const paginationOptions = (itemsNumber: number = DEFAULT_ITEMS_PER_PAGE): number[] => {
  return Array.from(new Set([itemsNumber, 5, 10, 25, 50].sort((a, b) => a - b)));
};

/**
 * Génère la configuration complète de pagination
 * @param itemsNumber nombre d’items par page
 * @returns objet { itemsPerPage, options }
 */
export const pagination = (itemsNumber: number = DEFAULT_ITEMS_PER_PAGE) => {
  return {
    itemsPerPage: itemsNumber,
    options: paginationOptions(itemsNumber),
  };
};
