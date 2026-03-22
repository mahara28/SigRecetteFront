import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './widgets/form/text-area/text-area.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Spinner } from './widgets/spinner/spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerContainerComponent } from './widgets/spinner-container/spinner-container.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { EnableOnlyArabicDirective } from './directives/enableOnlyArabic.directive';
import { NumbersOnlyInputDirective } from './directives/onlylettres.directive';
import { OnlyNumber } from './directives/onlynumber.directive';
import { NumberDirective } from './directives/phonenumber.directive';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorDirective } from './directives/control-error.directive';
import { ContainerDirective } from './directives/container.directive';
import { JpDraggableDialogDirective } from './directives/drag.directive';
import { BlockDirective } from './directives/block.directive';
import { CardDirective } from './directives/card.directive';
import { EditableInputDirective } from './directives/editable-input.directive';
import { MatCheckBoxDirective } from './directives/mat-check-box.directive';
import { ScreenDirective } from './directives/screen.directive';
import { SwiperDirective } from './directives/swiper.directive';
import { SwiperCpaDirective } from './directives/swipercpa.directive';
import { YearFormatDirective } from './directives';
import { DebounceClickDirective } from './directives/click.directive';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PrivateLayoutNavbar } from './widgets/layout/navbars/private-layout-navbar/private-layout-navbar';
import { PrivateLayoutSidebar } from './widgets/layout/private-layout-sidebar/private-layout-sidebar';
import { MatListModule } from '@angular/material/list';
import { FlatMenuList } from './widgets/layout/private-layout-sidebar/flat-menu-list/flat-menu-list';
import { FlotMenuList } from './widgets/layout/private-layout-sidebar/flot-menu-list/flot-menu-list';
import { MatMenuContent } from './widgets/layout/private-layout-sidebar/mat-menu-content/mat-menu-content';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  Breadcrumb,
  ButtonLoading,
  Card,
  ConfirmDialog,
  Datatable,
  DatatableExport,
  EmptyList,
  FicheDetails,
  Paginator,
  TextField,
} from './widgets';
import { Table } from './widgets/datatable/table/table';
import { BreadcrumbModule } from './widgets/angular-crumbs/src/lib';
import { MatCardModule, MatCardTitle } from '@angular/material/card';
import { CardTitle } from './widgets/card/card-title/card-title';
import {
  DateFormatheurePipe,
  DateFormatMMYYPipe,
  DateFormatPipe,
  HeureFormatPipe,
  MinutesFormatPipe,
  MontantPipe,
  OrderTranslatePipe,
  SafehtmlPipe,
  TypedValuePipe,
} from './pipes';
import { TruncatePipe } from './pipes/truncate.pipe';
import { DayMonthFormatPipe } from './pipes/day-month-format.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SelectDate } from './widgets/form/select-date/select-date';
import { SelectDateTime } from './widgets/form/select-date-time/select-date-time';
import { MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from 'ng-flex-layout';

@NgModule({
  declarations: [
    TextAreaComponent,
    TextField,
    Spinner,
    SpinnerContainerComponent,
    PrivateLayoutNavbar,
    PrivateLayoutSidebar,
    FlatMenuList,
    FlotMenuList,
    MatMenuContent,
    ConfirmDialog,
    Breadcrumb,
    Card,
    CardTitle,
    FicheDetails,
    Datatable,
    Table,
    DatatableExport,
    SelectDate,
    SelectDateTime,
    EmptyList,
    Paginator,
    ButtonLoading,
  ],
  exports: [
    MatMenuContent,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatCardTitle,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    TranslateModule,
    SpinnerContainerComponent,
    TextField,
    FicheDetails,
    MatFormFieldModule,
    CommonModule,
    //Composant
    PrivateLayoutNavbar,
    PrivateLayoutSidebar,
    FlatMenuList,
    FlotMenuList,
    ConfirmDialog,
    Datatable,
    Table,
    DatatableExport,
    BreadcrumbModule,
    Breadcrumb,
    Card,
    CardTitle,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    EmptyList,
    Paginator,
    ButtonLoading,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTreeModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    BreadcrumbModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatMenuTrigger,
    MatIcon,



    //******* Directive ********//
    BlockDirective,
    CardDirective,
    EnableOnlyArabicDirective,
    NumbersOnlyInputDirective,
    OnlyNumber,
    NumberDirective,
    ControlErrorDirective,
    ContainerDirective,
    JpDraggableDialogDirective,
    EditableInputDirective,
    MatCheckBoxDirective,
    ScreenDirective,
    SwiperDirective,
    SwiperCpaDirective,
    YearFormatDirective,
    DebounceClickDirective,

    //pipe
    DateFormatheurePipe,
    DateFormatPipe,
    MontantPipe,
    OrderTranslatePipe,
    SafehtmlPipe,
    TypedValuePipe,
    HeureFormatPipe,
    DateFormatMMYYPipe,
    TruncatePipe,
    DayMonthFormatPipe,
    MinutesFormatPipe,
  ],
})
export class AppSharedModule {}
