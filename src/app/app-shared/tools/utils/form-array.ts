import {UntypedFormArray} from '@angular/forms';

/**
 * Example: arr = [1, 2, 3]
 * previousOrder = 0, nextOrder = 2 // item with value 1 will be the last item
 * Result: [2, 3, 1]
 */
export function changeOrder(
    previousOrder: number,
    nextOrder: number,
    formArray: UntypedFormArray
): UntypedFormArray {
    const previous = Math.max(previousOrder, 0);
    const next = Math.min(nextOrder, formArray.controls.length - 1);
    const control = formArray.at(previous);
    const newFormArray = new UntypedFormArray([]);
    const others = formArray.controls.filter((c, ci) => ci !== previous);

    let i = 0;
    let j = 0;

    while (i < formArray.length) {
        if (i !== next) {
            newFormArray.insert(i, others[j]);
            j++;
        } else {
            newFormArray.insert(i, control);
        }
        i++;
    }

    return newFormArray;
}
