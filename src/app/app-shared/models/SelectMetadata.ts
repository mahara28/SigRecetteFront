export class SelectMetadata {
  label?: string;
  reset?: boolean;
  filter?: boolean;
  tooltip?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  grouping?: boolean;
  parentChild?: boolean;
  flotParentChild?: boolean;
  hideRequiredMarker?: boolean;
  optionLabel!: object | string;
  groupLabel!: object | string;
  value?: object | string;
  emittedValue?: string;
  
}
