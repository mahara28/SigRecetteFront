import { Component } from '@angular/core';
import { AppSharedModule } from "../../../../../app-shared/app-shared-module";
import { FilterListeNomenclature } from "./filter-liste-nomenclature/filter-liste-nomenclature";

@Component({
  selector: 'app-gestion-nomenclature',
  imports: [AppSharedModule, FilterListeNomenclature],
  templateUrl: './gestion-nomenclature.html',
  styleUrl: './gestion-nomenclature.css',
})
export class GestionNomenclature {

  selectedNomenclature: any;

}
