import { Moment } from "moment";

export class MobileDataCriterea {
  service_mobile_data_key: string;
  value: number | string | boolean | Moment;

  constructor(key: string, value: number | string | boolean) {
    this.service_mobile_data_key = key;
    this.value = value;
  }
}
