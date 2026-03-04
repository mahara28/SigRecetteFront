import {SimpleChanges} from '@angular/core';
import { isEmptyValue } from './functions.utils';



export function isInputChanged(changes: SimpleChanges, key: string): boolean {
    const change = changes[key];

    return !isEmptyValue(change) && change.previousValue !== change.currentValue;
}

export function isSomeInputsChanged(
    changes: SimpleChanges,
    keys: string[]
): boolean {
    return keys.some((key) => isInputChanged(changes, key));
}
