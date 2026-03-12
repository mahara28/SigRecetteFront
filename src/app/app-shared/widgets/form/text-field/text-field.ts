import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatFormFieldAppearance, MatFormField, MatLabel } from "@angular/material/form-field";
import { AppTranslateService  } from "../../../services/translate/translate.service";
import { hasrequiredField, isEmptyValue, isInputChanged } from "../../../tools/utils";
import { EnableOnlyArabicDirective } from "../../../directives";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "mc-text-field",
  templateUrl: "./text-field.html",
  standalone: false,
  styleUrls: ["./text-field.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TextField implements OnInit, OnChanges {
  protected readonly AppTranslateService = AppTranslateService;

  required = hasrequiredField;
  isEmptyValue = isEmptyValue;
  private readonly destroy$ = new Subject<void>();

  @ViewChild("select") select: any;

  @Input() appearance: MatFormFieldAppearance = "outline";
  @Input() type = "text";
  @Input() control: UntypedFormControl | any;
  @Input() placeholder = "";
  @Input() label = "";
  @Input() value = "";
  @Input() min?: any;
  @Input() max?: any;
  @Input() number = false;
  @Input() enableOnlyArabic = false;
  @Input() isIconPrefix = false;
  @Input() prefix!: string;
  @Input() hasReset = false;
  @Input() isSuffixClicked = false;
  @Input() isIconSuffix = false;
  @Input() suffix!: string;
  @Input() suffixStyleList: string = "";
  @Input() lettre = false;
  @Input() isMontant = false;
  @Input() isCourRef = false;
  @Input() isMntD = false;
  @Input() numberphone = false;
  @Input() hideRequiredMarker = false;
  @Input() isWithAutocomplete = false;

  @Input() listData: any[] = [];
  listFilteredOptions: any[] = [];

  @Input() isDisabled = false;
  @Input() itemToFilterWith: string = "";
  @Input() hasTooltip: boolean = false;
  @Input() hint!: string;
  @Input() isDatatableHeaderSearchField: boolean = false;
  @Input() matFormFieldStyle: string = "";
  @Input() isListAutocompleteLoading = false;

  @Input() typedValue: string = "";
  @Input() read = false;
  @Input() formated = false;
  @Input() isListLoadisg = false;
  @Input() isGet = false;
  @Input() msgEmptyList: string = "Désolé, n'existe pas dans la liste";

  @Output() keyUpEvent = new EventEmitter<any>();
  @Output() onChangeEvent = new EventEmitter<any>();
  @Output() onFocusEvent = new EventEmitter<any>();
  @Output() emitSelectedValueEvent = new EventEmitter<any>();
  @Output() suffixClickedEvent = new EventEmitter<any>();

  constructor(
    public appTranslateService: AppTranslateService,
    private cdr: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    if (this.isWithAutocomplete && this.control.value) {
      this.typedValue = this.control.value;
    }
  }
 ngOnChanges(changes: SimpleChanges): void {
  if (isInputChanged(changes, 'control')) {
    this.control = changes['control'].currentValue;
  }

  // ✅ accès sécurisé pour listData
  if (changes['listData']) {
    this.loadDataSource(changes['listData'].currentValue);
  }
}

loadDataSource(listData: any[]): void {
    this.listData = listData ?? [];
    this.filterListData();
  }

emitTypedValue(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const maxLength = this.max ?? undefined;
    let value = input.value;

    if (maxLength && value.length >= maxLength) event.preventDefault();

    this.keyUpEvent.emit(value);
  }

  filterListData(): void {
    if (!this.typedValue) {
      this.listFilteredOptions = [...this.listData];
    } else {
      const filterText = this.typedValue.toLowerCase();
      this.listFilteredOptions = this.listData.filter(opt =>
        opt[this.itemToFilterWith]?.toString().toLowerCase().includes(filterText)
      );
    }
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.control.setValue(null);
    this.onChangeEvent.emit(null);
  }

  getErrorMessage(): string {
    const c = this.control;
    if (!c || !(c.touched || c.dirty)) return '';
    const lang = this.AppTranslateService?.getDefaultLang?.() ?? 'fr';

    if (c.hasError('required')) return lang === 'fr' ? 'Ce champ est obligatoire' : 'هذا الحقل إجباري';
    if (c.hasError('minlength')) return lang === 'fr' ? `Mot de passe trop court` : `كلمة المرور قصيرة جدًا`;
    if (c.hasError('maxlength')) return lang === 'fr' ? `Valeur trop longue` : `القيمة طويلة جدًا`;
    if (c.hasError('email')) return lang === 'fr' ? 'Adresse e-mail invalide' : 'البريد الإلكتروني غير صالح';
    if (c.hasError('pattern')) return lang === 'fr' ? 'Format invalide' : 'تنسيق غير صالح';

    return '';
  }

  public format(data: any): void {
  if (!data) return;
   
  if (this.isCourRef || this.isMntD) {
    let val = data.toString().replace(/[^\d.]/g, '');
    this.control.setValue(val ? Number(val) : null);
  }
}

// onChange pour template
public onChange(event: any): void {
  this.onChangeEvent.emit(event.target?.value);
}
}
