import { Component } from '@angular/core';

@Component({
  selector: 'mc-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card implements OnInit, OnChanges{

  @Input() metadata: any;
  @Output() onSaveClicked = new EventEmitter<any>();
  @Output() onAddClicked = new EventEmitter<any>();
  @Output() onShowlicked = new EventEmitter<any>();
  @Output() onBlockclicked = new EventEmitter<any>();
  @Output() onReplacelicked = new EventEmitter<any>();
  @Output() onDeleteAllClicked = new EventEmitter<any>();
  @Output() onImportClicked = new EventEmitter<any>();
  @Output() onFilterKeyUp = new EventEmitter<any>();
  @Output() onGenerateFile = new EventEmitter<any>();

  @ViewChild("fileUpload") fileUpload!: ElementRef;
  params: object = {};
constructor(
    private formBuilder: UntypedFormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadMetadata(this.metadata);
    this.initParams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isInputChanged(changes, "metadata")) {
      this.loadMetadata(changes.metadata.currentValue);
    }
  }

   get hasHeader(): boolean {
    return (
      !isEmptyValue(this.metadata.title) ||
      this.metadata.hasAdd ||
      this.metadata.hasCheckAll ||
      this.metadata.hasFilter ||
      this.metadata.hasExport
    );
  }

  initParams() {
    if (this.metadata.hasFilter) {
      this.params["formRapidSearch"] = <UntypedFormGroup>this.formBuilder.group({
        typedValue: this.formBuilder.control(""),
      });
      this.breakpointObserver.observe(["(max-width: 767px)"]).subscribe((result) => {
        this.params["isSmallScreen"] = result.matches;
      });
    }
  }

  loadMetadata(metadata) {
    this.metadata = {
      title: metadata?.title,
      styleList: {
        card: metadata?.styleList?.card ?? {},
        cardContent: metadata?.styleList?.cardContent ?? {},
      },
      classList: {
        card: metadata?.classList?.card ?? "mb-3",
        cardContent: metadata?.classList?.cardContent ?? "py-3 px-4 overflow-hidden",
      },
      headerClass: {
        card: metadata?.headerClass?.card ?? "",
      },

      cardTooltips: {
        add:  metadata?.cardTooltips?.add ?? "general.icons.tooltip.add",
        delete:  metadata?.cardTooltips?.delete ?? "general.icons.tooltip.delete_item",
        show:  metadata?.cardTooltips?.show ?? "general.icons.tooltip.show",
        validate:  metadata?.cardTooltips?.validate ?? "general.icons.tooltip.validate",
        block:  metadata?.cardTooltips?.block ?? "general.icons.tooltip.block",
        replace:  metadata?.cardTooltips?.replace ?? "general.icons.tooltip.replace",
        import:  metadata?.cardTooltips?.import ?? "general.import",
      },
      isMultiple: metadata?.isMultiple ?? false,
      uploadType: metadata?.uploadType ?? ".csv, .xlsx",
      hasAdd: metadata?.hasAdd ?? false,
      hasDelete: metadata?.hasDelete ?? false,
      hasCheckAll: metadata?.hasCheckAll ?? false,
      hasExport: metadata?.hasExport ?? false,
      hasImport: metadata?.hasImport ?? false,
      hasShow: metadata?.hasShow ?? false,
      hasreplace:metadata?.hasreplace?? false,
      hasblock: metadata?.hasblock ?? false,
      hasFilter: metadata?.hasFilter ?? false,
      hasSave: metadata?.hasSave??false
    };
  }

  clear() {
    (<UntypedFormControl>this.params["formRapidSearch"].get("typedValue")).setValue(null);
    this.onFilterKeyUp.emit(null);
  }

  onImportClickedfn(event) {

    this.onImportClicked.emit(this.fileUpload.nativeElement.files);
    // Clear the file input after processing the file
    (event.target as HTMLInputElement).value = "";

  }
  onShowClickedfn() {

     this.onShowlicked.emit();
  }

  onReplaceClickedfn(){
      this.onReplacelicked.emit();
  }
  onblockClickedfn(){
    this.onBlockclicked.emit();

  }

  protected readonly Object = Object;
  protected readonly isEmptyValue = isEmptyValue;
}
