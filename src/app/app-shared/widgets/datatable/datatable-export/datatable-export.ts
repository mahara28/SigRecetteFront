import { Component, Output, EventEmitter } from '@angular/core';
import { MatTooltip } from "@angular/material/tooltip";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { EXPORT_TYPES_CODES } from '../../../constantes/Constantes';
import {  CommonModule } from '@angular/common';

@Component({
  selector: 'mc-datatable-export',
  imports: [MatTooltip, MatIcon, MatMenu, MatMenuTrigger, CommonModule],
  templateUrl: './datatable-export.html',
  styleUrl: './datatable-export.css',
})
export class DatatableExport {
@Output() onGenerateFile = new EventEmitter<string>();
options = Object.values(EXPORT_TYPES_CODES);

}
