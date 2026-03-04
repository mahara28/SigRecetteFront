export function unique(array: any[]): any[] {
    return Array.from(new Set(array));
}

export function uniqueByProperty<M>(array: M[], property: keyof M): M[] {
    const map = new Map();

    array.forEach((item) => {
        const key = item[property];
        if (!map.has(key)) {
            map.set(key, item);
        }
    });

    return Array.from(map.values());
}

export function sum<M>(array: M[], property: keyof M): number {
    return array.reduce((acc, curr) => {
        const x = (curr[property] as unknown) as number;
        return acc + (x || 0);
    }, 0);
}
