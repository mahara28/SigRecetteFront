export class FicheDetailsMetadata {
  ref: string;
  title: string;
  columns: { key: string | object, label: string, type: 'text' | 'date' | 'datetime' | 'montant' | 'other' | null | undefined, template: string | null }[];

  constructor(ref: string = '', title: string = '', columns: { key: string | object, label: string, type: 'text' | 'date' | 'datetime' | 'montant' | 'other' | null | undefined, template: string | null }[]) {
    this.ref = ref;
    this.title = title;
    this.columns = columns;
  }
}
