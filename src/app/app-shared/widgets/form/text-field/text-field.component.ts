import {
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
import { AppTranslateService } from "../../../services/translate/translate.service";
import { hasrequiredField, isEmptyValue } from "../../../tools/utils";
import { EnableOnlyArabicDirective } from "../../../directives";

@Component({
  selector: "mc-text-field",
  templateUrl: "./text-field.component.html",
  standalone: false,
  styleUrls: ["./text-field.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TextFieldComponent implements OnInit, OnChanges {
  protected readonly AppTranslateService = AppTranslateService;
  listFilteredOptions = [];
  required = hasrequiredField;
  isEmptyValue = isEmptyValue;


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
  @Input() listData = [];
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

  constructor() { }
  ngOnInit(): void {
    if (this.isWithAutocomplete && this.control.value) {
      this.typedValue = this.control.value;
    }
  }






  ngOnChanges(changes: SimpleChanges): void {
    const { listData } = changes;
    if (listData) {
      if (listData.currentValue !== listData.previousValue) {
        this.loadDataSource(listData.currentValue);
      }
    }
  }

  loadDataSource(listData:any) {
    this.listData = listData;
    this.filterListData();
  }

  emitTypedValue(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const maxLength = this.max ? parseInt(this.max, 10) : undefined;

    if (maxLength !== undefined && inputElement.value.length >= maxLength) {
      event.preventDefault();
      // Check if the user has the content selected
      const selectionStart = inputElement.selectionStart;
      const selectionEnd = inputElement.selectionEnd;
      if (
        selectionStart !== null &&
        selectionEnd !== null &&
        selectionStart !== selectionEnd
      ) {
        const currentValue = inputElement.value;
        const newValue =
          currentValue.substring(0, selectionStart) +
          event.key +
          currentValue.substring(selectionEnd);

        if (newValue.length <= maxLength) {
          // Check the value type
          if (this.number) {
            if (!isNaN(Number(newValue))) inputElement.value = newValue;
          } else {
            inputElement.value = newValue;
          }
          inputElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
        }
      }
      this.keyUpEvent.emit(inputElement.value);
    } else {
      this.keyUpEvent.emit(inputElement.value);
    }
  }

  filterListData() {
    if (!this.typedValue) {
      this.listFilteredOptions = [...this.listData];
    } else {
      this.listFilteredOptions = this.listData.filter((option) => {
        const value = String(option[this.itemToFilterWith] ?? '');

        return value
        .toLowerCase()
        .includes(this.typedValue.toString().toLowerCase());

      });
    }
  }

  format(data:any) {
    if (!isEmptyValue(data) && this.isCourRef) {
      data = data
        .toString()
        .replace(/[^0-9.]*!/g, "")
        .replace(",", ".")
        .replace(/[^\d\.]/g, "")
        .replace(/\./, "x")
        .replace(/\./g, "")
        .replace(/x/, ".")
        .replace(/^\.+/, "")
        .replace(/^0+/, "");
      if (data.toString().includes(".")) {
        let indexVirgule = data.indexOf(".");
        if (
          data.substring(0, indexVirgule).length > 2 ||
          data.substring(indexVirgule + 1, data.length).length > 4
        ) {
          this.control.setErrors({ "general.erreur_montant": true });
        } else {
          if (this.isCourRef && !isNaN(data)) {
            this.control.setValue(Number(data));
          }
        }
      } else {
        if (data.length > 12) {
          this.control.setErrors({ "general.erreur_montant": true });
        } else {
          if (this.isCourRef && !isNaN(data)) {
            this.control.setValue(Number(data));
          }
        }
      }
    }
    if (!isEmptyValue(data) && this.isMntD) {
      data = data
        .toString()
        .replace(/[^0-9.]*!/g, "")
        .replace(",", ".")
        .replace(/[^\d\.]/g, "")
        .replace(/\./, "x")
        .replace(/\./g, "")
        .replace(/x/, ".")
        .replace(/^\.+/, "")
        .replace(/^0+/, "");
      if (data.toString().includes(".")) {
        let indexVirgule = data.indexOf(".");
        if (
          data.substring(0, indexVirgule).length > 6 ||
          data.substring(indexVirgule + 1, data.length).length > 3
        ) {
          this.control.setErrors({ "general.erreur_montant": true });
        } else {
          if (this.isMntD && !isNaN(data)) {
            this.control.setValue(Number(data));
          }
        }
      } else {
        if (data.length > 12) {
          this.control.setErrors({ "general.erreur_montant": true });
        } else {
          if (this.isMntD && !isNaN(data)) {
            this.control.setValue(Number(data));
          }
        }
      }
    }
  }

  onOptionSelected(event:any) {
    if (this.isGet) {
      this.typedValue = "";
      this.control.setValue(null);
      this.emitSelectedValueEvent.emit(event.option.value);
    } else {
      this.typedValue = event.option.value[this.itemToFilterWith];
      this.emitSelectedValueEvent.emit(event.option.value);
    }
  }

  onChange(event:any) {
    this.onChangeEvent.emit(event.target.value);
  }


  clear($event: MouseEvent) {
    $event.stopPropagation();
    this.control.setValue(null);
    this.onChangeEvent.emit(null);
  }

  getErrorMessage(): string {
    const c = this.control;
    if (!c) return '';

    // langue par défaut (fr / ar)
    const lang = this.AppTranslateService?.getDefaultLang?.() ?? 'fr';

    if (!(c.touched || c.dirty)) return '';

    // required
    if (c.hasError('required') && (!c.value || c.value === '')) {
      return lang === 'fr'
        ? 'Ce champ est obligatoire'
        : 'هذا الحقل إجباري';
    }

    const valueLength = c.value ? (c.value.length ?? 0) : 0;

    // exact length (min == max)
    if (c.hasError('maxlength') && c.hasError('minlength')) {
      const err = c.getError('minlength');
      const requiredLength = err?.requiredLength ?? (this.min ? Number(this.min) : undefined);
      return lang === 'fr'
          ? `La valeur doit contenir exactement ${requiredLength} caractères`
          : `يجب أن يحتوي على ${requiredLength} أرقام`;
    }
    if (this.min && this.max && Number(this.min) === Number(this.max)) {
      const requiredLength = Number(this.min);
      if (valueLength > 0 && valueLength !== requiredLength) {
        return lang === 'fr'
          ? `La valeur doit contenir exactement ${requiredLength} caractères`
          : `يجب أن يحتوي على ${requiredLength} أرقام`;
      }
    }

    // minlength
    if (c.hasError('minlength')) {
      const err = c.getError('minlength');
      const requiredLength = err?.requiredLength ?? (this.min ? Number(this.min) : 6);
      return lang === 'fr'
        ? `Mot de passe trop court (minimum ${requiredLength} caractères)`
        : `كلمة المرور قصيرة جدًا (الحد الأدنى ${requiredLength} أحرف)`;
    }
    if (this.min && valueLength > 0 && valueLength < Number(this.min)) {
      return lang === 'fr'
        ? `Valeur trop courte (minimum ${this.min} caractères)`
        : `القيمة قصيرة جدًا (الحد الأدنى ${this.min} أحرف)`;
    }

    // maxlength
    if (c.hasError('maxlength')) {
      const err = c.getError('maxlength');
      const requiredLength = err?.requiredLength ?? (this.max ? Number(this.max) : undefined);
      return lang === 'fr'
        ? `Valeur trop longue (maximum ${requiredLength} caractères)`
        : `القيمة طويلة جدًا (الحد الأقصى ${requiredLength} أحرف)`;
    }
    if (this.max && valueLength > Number(this.max)) {
      return lang === 'fr'
        ? `Valeur trop longue (maximum ${this.max} caractères)`
        : `القيمة طويلة جدًا (الحد الأقصى ${this.max} أحرف)`;
    }




    // email
    if (c.hasError('email')) {
      return lang === 'fr'
        ? 'Adresse e-mail invalide'
        : 'البريد الإلكتروني غير صالح';
    }

    if (c.hasError('invalidIp')) {
      return lang === 'fr'
        ? "Adresse IP invalide"
        : "عنوان IP غير صالح";
    }



    // pattern
    if (c.hasError('pattern')) {
      return lang === 'fr'
        ? 'Format invalide'
        : 'تنسيق غير صالح';
    }

    return '';
  }



}
