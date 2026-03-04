import moment from 'moment';
// Correction 1 : Définition locale de la fonction utilitaire (Codelyzer n'existe plus)
export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export const SPRING_FORMAT = 'YYYY-MM-DD HH:mm:ss.S';
export const dateInput = 'DD MMM YYYY';
// Correction 2 : Utilisation de moment.ISO_8601 (assure-toi que moment est installé)
export const dateFormats = [SPRING_FORMAT, moment.ISO_8601];

/**
 * Vérifie si la date est valide selon les formats définis
 */
export function isValidDate(value: any): boolean {
    return moment(value, dateFormats, true).isValid();
}

/**
 * Vérifie la validité d'une date avec une logique spécifique aux chaînes de caractères
 */
export function isValidDate2(value: any): boolean {
    // Correction 3 : Utilisation de la fonction locale et ajout d'un retour par défaut
    if (isNotNullOrUndefined(value)) {
        const dateStr = value.toString();
        if (dateStr.includes(':') && !dateStr.includes('(')) {
            return moment(value, dateFormats, false).isValid();
        }
    }
    return false; // Toujours retourner un boolean (meilleure pratique TS)
}
