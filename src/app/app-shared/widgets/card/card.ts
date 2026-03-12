import {
  Component,
  input,
  computed,
  OnInit,
  inject,
  output,
  Output,
  viewChild,
  ElementRef,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { isEmptyValue } from '../../tools';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
@Component({
  selector: 'mc-card',
  standalone: false,
  templateUrl: './card.html',
  styleUrl: './card.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Card implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild('printSection', { static: true }) printSection!: ElementRef;

  // Signal Inputs
  metadataInput = input.required<any>({ alias: 'metadata' });

  // Outputs (Nouvelle syntaxe output)
  onSaveClicked = output<void>();
  onAddClicked = output<void>();
  onShowClicked = output<void>();
  onBlockClicked = output<void>();
  onReplaceClicked = output<void>();
  onDeleteAllClicked = output<void>();
  onImportClicked = output<FileList>();
  onFilterKeyUp = output<any>();
  onGenerateFile = output<any>();
  onImprimeClicked = output<void>();

  fileUpload = viewChild<ElementRef<HTMLInputElement>>('fileUpload');
  params: object = {};

  // Signal pour détecter le mobile (remplace le subscribe manuel)
  isSmallScreen = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(map((res) => res.matches)),
  );

  // Metadata formatée via un Signal calculé (très performant)
  metadata = computed(() => {
    const m = this.metadataInput();
    console.log(m);
    return {
      title: m?.title,
      styleList: {
        card: m?.styleList?.card ?? {},
        cardContent: m?.styleList?.cardContent ?? {},
      },
      classList: {
        card: m?.classList?.card ?? 'mb-3',
        cardContent: m?.classList?.cardContent ?? 'py-3 px-4',
      },
      cardTooltips: {
        add: m?.cardTooltips?.add ?? 'general.icons.tooltip.add',
        delete: m?.cardTooltips?.delete ?? 'general.icons.tooltip.delete_item',
        show: m?.cardTooltips?.show ?? 'general.icons.tooltip.show',
        validate: m?.cardTooltips?.validate ?? 'general.icons.tooltip.validate',
        block: m?.cardTooltips?.block ?? 'general.icons.tooltip.block',
        replace: m?.cardTooltips?.replace ?? 'general.icons.tooltip.replace',
        import: m?.cardTooltips?.import ?? 'general.import',
        imprime: m?.cardTooltips?.imprime ?? 'general.imprime',
      },
      hasAdd: m?.hasAdd ?? false,
      hasDelete: m?.hasDelete ?? false,
      hasFilter: m?.hasFilter ?? false,
      hasExport: m?.hasExport ?? false,
      hasImport: m?.hasImport ?? false,
      hasShow: m?.hasShow ?? false,
      hasReplace: m?.hasreplace ?? false,
      hasBlock: m?.hasblock ?? false,
      hasSave: m?.hasSave ?? false,
      hasImprime: m?.hasImprime ?? false,
      uploadType: m?.uploadType ?? '.csv, .xlsx',
      isMultiple: m?.isMultiple ?? false,
    };
  });

  // Calcul du header via Signal
  hasHeader = computed(() => {
    const m = this.metadata();
    return !isEmptyValue(m.title) || m.hasAdd || m.hasFilter || m.hasExport || m.hasImprime;
  });

  formRapidSearch: FormGroup = this.fb.group({
    typedValue: [''],
  });

  ngOnInit(): void {
    if (this.metadataInput()?.hasFilter) {
      this.formRapidSearch.get('typedValue')?.valueChanges.subscribe((value) => {
        this.onFilterKeyUp.emit(value);
      });
    }

    if (this.metadataInput()?.hasImprime) {
      console.log('hase imprime icone');
    }
  }

  clear() {
    this.formRapidSearch.get('typedValue')?.setValue(null);
    this.onFilterKeyUp.emit(null);
  }

  onImportClickedfn(event: Event) {
    const files = this.fileUpload()?.nativeElement.files;
    if (files) {
      this.onImportClicked.emit(files);
      (event.target as HTMLInputElement).value = '';
    }
  }

  printPage() {}
}
