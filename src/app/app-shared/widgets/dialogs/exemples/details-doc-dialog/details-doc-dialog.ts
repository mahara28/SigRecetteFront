
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ViewChild,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { COMMON_METADATA } from '../../../../constantes/common-metadata';
import { datatableSorting, downloadLocalFile, isEmptyValue, onAction } from '../../../../tools';
import { SharedService } from '../../../../services/sharedWs/shared.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { RequestObject } from '../../../../models/RequestObject';
import { GED_URI } from '../../../../../layouts/private/shared/constantes/common/ged.uri';
import { ConstanteWs } from '../../../../constantes/constante-ws';
import { Datatable } from '../../../datatable/datatable';
import { ResponseObject } from '../../../../models/ResponseObject';
import { Sort } from '../../../../models/Sort';
import { Pagination } from '../../../../models/Pagination';


@Component({
  selector: 'mc-details-doc-dialog',
  imports: [MatDialogModule, CommonModule,FormsModule, MatDialogModule],
  templateUrl: './details-doc-dialog.html',
  styleUrl: './details-doc-dialog.css',
})
export class DetailsDocDialog    {


}



