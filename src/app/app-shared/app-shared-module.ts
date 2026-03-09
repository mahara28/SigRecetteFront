import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './widgets/form/text-area/text-area.component';
import { TextFieldComponent } from './widgets/form/text-field/text-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Spinner } from './widgets/spinner/spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerContainerComponent } from './widgets/spinner-container/spinner-container.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
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
@NgModule({
  declarations: [
    TextAreaComponent,
    TextFieldComponent,
    Spinner,
    SpinnerContainerComponent,
    PrivateLayoutNavbar,
    PrivateLayoutSidebar,
    FlatMenuList,
    FlotMenuList,
    MatMenuContent,
  ],
  exports: [
    TextFieldComponent,
    PrivateLayoutNavbar,
    PrivateLayoutSidebar,
    FlatMenuList,
    FlotMenuList,
    MatMenuContent,
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
  ],
})
export class AppSharedModule {}
