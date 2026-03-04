export function isEmptyValue(val: any): boolean {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string') return val.trim() === '';
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
}
