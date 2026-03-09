import {AbstractControl, ValidatorFn} from '@angular/forms';

const isValidIdentifier = (identifier: string): boolean => {
    if (identifier.length !== 10) {
        return false;
    }
    if (isNaN(Number(identifier))) {
        return false;
    }

    const firstPart = Number(identifier.slice(0, 8));
    const secondPart = Number(identifier.slice(-2));

    return secondPart === firstPart % 97;
};

const error = {invalid_identifier: 'invalid_identifier'};

export function TeacherValidatorIdentifierValidator(): ValidatorFn {
    return (currentControl: AbstractControl): typeof error | null => {
        const {value} = currentControl;
        const isValid = isValidIdentifier(value);
        return isValid ? null : error;
    };
}
