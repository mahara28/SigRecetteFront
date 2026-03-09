
import { Component, OnInit, inject, signal, viewChild, ElementRef, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { saveAs } from "file-saver";

import { Datatable } from '../../../datatable/datatable';
import { ButtonLoading } from '../../../buttons/button-loading/button-loading';
import { SharedService } from '../../../../services/sharedWs/shared.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ConfirmDialogService } from '../../../../services/confirm-dialog.service.ts/confirm-dialog.service';
import { COMMON_METADATA } from '../../../../constantes/common-metadata';
import { GED_URI } from '../../../../../layouts/private/shared/constantes/common/ged.uri';
import { ConstanteWs } from '../../../../constantes/constante-ws';
import { Dialog } from "../../dialog/dialog";
import { TextFieldModule } from '@angular/cdk/text-field';
import { TextFieldComponent } from '../../../form/text-field/text-field.component';
import { onAction } from '../../../../tools';


@Component({
  selector: 'mc-ajout-doc-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, Datatable, ButtonLoading, Dialog],
  templateUrl: './ajout-doc-dialog.html',
  styleUrl: './ajout-doc-dialog.css',
})
export class AjoutDocDialog implements OnInit {
  private fb = inject(FormBuilder);
  private sharedService = inject(SharedService);
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);
  public dialogRef = inject(MatDialogRef<AjoutDocDialog>);
  public data = inject(MAT_DIALOG_DATA);

  protected datatableMetadata = COMMON_METADATA.dialogAddDoc.tableAtachFiles;

  onAction = onAction;


  // Signaux pour l'état du composant
  protected saveDocLoading = signal(false);
  protected listAttachFiles = signal<File[]>([]);

  // ViewChild moderne
  protected fileUpload = viewChild<ElementRef<HTMLInputElement>>('fileUpload');

  form!: FormGroup;
  title = signal<string>('');
  ngOnInit(): void {
    this.initForm();
    this.initMetadata();
    this.loadInitialFiles();
  }

  private initForm() {
    const isEdit = !!this.data?.item?.id;
    this.title.set(isEdit ? "general.modif_doc_dialog.title" : "general.add_doc_dialog.title");

    const group: any = {};
    COMMON_METADATA.dialogAddDoc.form.controls.forEach((c: any) => {
      const val = isEdit ? this.data.item[c.key] : (c.key === 'numDoc' ? (this.data.item?.code || this.data.document) : null);
      group[c.key] = [{ value: val, disabled: c.disabled }, c.required ? Validators.required : []];
    });
    this.form = this.fb.group(group);
  }

  private initMetadata() {
    this.data.title = this.data.title || 'general.add_doc_dialog.title';
    this.title.set(this.data.title);
  }

  private loadInitialFiles() {
    if (!this.data?.item?.idNodeRef) return;

    this.sharedService.commonWs({
      uri: GED_URI.LIST_FICHIER,
      params: { query: { nodeRef: this.data.item.idNodeRef } },
      method: ConstanteWs._CODE_GET
    })
    .pipe(takeUntilDestroyed())
    .subscribe(res => {
      if (res.code === ConstanteWs._CODE_WS_SUCCESS) {
        this.listAttachFiles.set(res.payload.map((f: any) => ({ ...f, name: f.fileName })));
      }
    });
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.listAttachFiles.update(files => [...files, ...Array.from(input.files!)]);
    }
  }

  protected onSave() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    this.saveDocLoading.set(true);
    const payload = { ...this.form.getRawValue(), ...this.getExtraContext() };

    this.sharedService.commonWs({
      uri: GED_URI.SAVE_DOCUMENT,
      params: { formData: { document: payload, listFiles: this.listAttachFiles() } },

      method: ConstanteWs._CODE_POST,
      speCase: 'upload'
    })
    .pipe(takeUntilDestroyed())
    .subscribe({
      next: (res: any) => {
        if (res.type === HttpEventType.UploadProgress) {
          // Logique de progression
        } else if (res instanceof HttpResponse) {
          this.handleSaveResponse(JSON.parse(res.body));
        }
      },
      error: () => { this.toast.error(); this.saveDocLoading.set(false); }
    });
  }

  private getExtraContext() {
    return {
      idDecaissement: this.data.item?.idDecaissement || this.data.idDecaissement,
      // ... autres mappages
    };
  }

  private handleSaveResponse(result: any) {
    this.saveDocLoading.set(false);
    if (result.code === ConstanteWs._CODE_WS_SUCCESS) {
      this.toast.success('general.success_save');
      this.dialogRef.close({ data: result });
    } else {
      this.toast.error();
    }
  }
}
