import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog implements OnInit {
  title = 'general.confirm_dialog.title';
  description = 'general.confirm_dialog.description';
  btn1Label = 'general.approve';
  btn2Label = 'general.cancel';

  descriptionObjection = '';
  labelchexbox = 'confirm_data_valid';
  count = 0;
  withcheckbox = false;
  showDescription2 = false;
  showApprove: any;

  ngOnInit(): void {}

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog, boolean>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    data: {
      title?: string;
      description?: string;
      count?: number;
      withcheckbox?: boolean;
      labelcheckBox?: string;
      btn1Label?: string;
      btn2Label?: string;
      showDescription2?: boolean;
      showApprove?: boolean;
    },
  ) {
    const {
      title,
      description,
      count,
      withcheckbox,
      labelcheckBox,
      btn1Label,
      btn2Label,
      showDescription2,
      showApprove,
    } = data;
    this.setTitle(title);
    this.setDescription(description);

    this.setcont(count);
    this.setwithcheckbox(withcheckbox);
    this.setTlabel(labelcheckBox);
    this.setBtn1Label(btn1Label!);
    this.setBtn2Label(btn2Label!);
    this.setApprove(showApprove!);
    this.showDescription2 = showDescription2 ?? false;
  }

  setTitle(title?: string) {
    if (Boolean(title)) {
      this.title = title!;
    }
  }

  setTlabel(labelcheckBox?: string) {
    if (Boolean(labelcheckBox)) {
      this.labelchexbox = labelcheckBox!;
    }
  }

  setwithcheckbox(withcheckbox?: boolean) {
    if (Boolean(withcheckbox)) {
      this.withcheckbox = withcheckbox!;
    }
  }

  setDescription(description?: string) {
    if (Boolean(description)) {
      this.description = description!;
    }
  }

  private setBtn1Label(btn1Label: string) {
    if (Boolean(btn1Label)) {
      this.btn1Label = btn1Label;
    }
  }

  private setBtn2Label(btn2Label: string) {
    if (Boolean(btn2Label)) {
      this.btn2Label = btn2Label;
    }
  }

  setcont(count?: number) {
    if (count! > 0) {
      const t = this.translate.get('objections_en_cours', { count });
      t.subscribe((v: any) => {
        this.descriptionObjection = v;
      });
    }
  }

  setApprove(approval: boolean) {
    this.showApprove = approval != false;
  }

  respond(confirm: boolean) {
    this.dialogRef.close(confirm);
  }
}
