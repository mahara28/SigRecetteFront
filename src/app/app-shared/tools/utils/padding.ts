export function zeroPadding(str: string | number, minLength: number): string {
    const zeros = Math.max(0, minLength - str.toString().length);

    return `${'0'.repeat(zeros)}${str}`;
}
