import {AbstractControl} from '@angular/forms';

export function hasrequiredField(abstractControl: AbstractControl): boolean {
    if (abstractControl?.validator) {
        const validator = abstractControl?.validator({} as AbstractControl);

        if (validator && validator?.['required']) {
            return true;
        }
    }

    return false;
}
