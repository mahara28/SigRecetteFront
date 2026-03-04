export function urlJoin(...paths: (string | number)[]): string {
    return paths.map(String).join('/');
}
