
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { SpinnerConfig } from '../../models/SpinnerConfig';
import { Loading } from '../../services/loading/loading';

@Component({
  selector: 'app-spinner',
  standalone: false,
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.css']
})
export class Spinner implements OnInit {
  spinnerConfig!: SpinnerConfig;
  color: ThemePalette = 'primary';

  constructor(
    public dialogRef: MatDialogRef<Spinner>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Initialisation de la configuration du spinner
    this.initializeSpinnerConfig();
  }

  /**
   * Initialise la configuration du spinner
   */
  private initializeSpinnerConfig(): void {
    if (this.data?.determinate) {
      this.spinnerConfig = Loading.SPINNER_PROGRESS_CONFIG;
    } else {
      this.spinnerConfig = this.data?.spinnerConfig || new SpinnerConfig();
    }

    // Définir la couleur
    this.color = this.spinnerConfig?.color || 'primary';
  }

  /**
   * Ferme le dialogue
   */
  close(): void {
    this.dialogRef.close();
  }
}
