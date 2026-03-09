import {AbstractControl, ValidatorFn} from '@angular/forms';

const passwordMismatchError = {password_mismatch: 'password_mismatch'};

export function PasswordMatches(control: AbstractControl): ValidatorFn {
    return (currentControl: AbstractControl): typeof passwordMismatchError | null => {
        const currentValue = currentControl.value;
        const controlValue = control.value;
        const passwordMismatch = !!currentValue && currentValue !== controlValue;
        return passwordMismatch ? passwordMismatchError : null;
    };
}
