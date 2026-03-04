import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

export class SpinnerConfig {
    isLoading: boolean;
    diametre: number;
    color: ThemePalette;
    mode: ProgressSpinnerMode;
    value: number;
    msg: string;
    withSpinner: boolean;

    constructor(isLoading = false, diametre = 30, color: ThemePalette = 'primary', mode: ProgressSpinnerMode = 'indeterminate', value = 0, msg = '', withSpinner= true) {
        this.isLoading = isLoading;
        this.diametre = diametre;
        this.color = color;
        this.mode = mode;
        this.value = value;
        this.msg = msg;
        this.withSpinner = withSpinner;
    }

}
