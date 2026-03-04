import { Moment } from "moment";

export class FixeDataCriterea {
  service_fix_data_key: string;
  value: number | string | boolean | Moment;

  constructor(key: string, value: number | string | boolean) {
    this.service_fix_data_key = key;
    this.value = value;
  }
}
