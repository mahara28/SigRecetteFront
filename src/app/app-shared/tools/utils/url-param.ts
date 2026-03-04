
/**
 * Interface pour les paramètres de requête
 */
export interface QueryParams {
  [key: string]: string | number | boolean | null | undefined | string[] | number[];
}

/**
 * Ajoute des paramètres de requête à une URL
 * @param url - L'URL de base
 * @param params - Les paramètres à ajouter
 * @returns L'URL complète avec les paramètres
 */
export function withParams(url: string, params: QueryParams): string {
  if (!params || typeof params !== 'object') {
    return url;
  }

  const keys = Object.keys(params).filter(key =>
    params[key] !== null && params[key] !== undefined && params[key] !== ''
  );

  if (!keys.length) {
    return url;
  }

  const queryParams: string[] = [];

  keys.forEach((key) => {
    const value = params[key];

    if (Array.isArray(value)) {
      // Gestion des tableaux (ex: ids=1&ids=2&ids=3)
      value.filter(v => v != null && v !== '').forEach(v => {
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
      });
    } else {
      // Gestion des valeurs simples
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });

  return queryParams.length ? `${url}?${queryParams.join('&')}` : url;
}
