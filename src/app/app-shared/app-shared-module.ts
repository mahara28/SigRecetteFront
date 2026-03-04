import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './widgets/form/text-area/text-area.component';
import { TextFieldComponent } from './widgets/form/text-field/text-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Spinner } from './widgets/spinner/spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerContainerComponent } from './widgets/spinner-container/spinner-container.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from "@angular/material/tree";
import { MatMenuModule } from "@angular/material/menu";
@NgModule({
  declarations: [
    TextAreaComponent,
    TextFieldComponent,
    Spinner,
    SpinnerContainerComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatTreeModule,
    MatMenuModule,
    MatFormFieldModule,
    TranslateModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,

  ]
})
export class AppSharedModule { }
