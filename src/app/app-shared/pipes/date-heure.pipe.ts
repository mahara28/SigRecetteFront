import { Pipe, PipeTransform } from "@angular/core";

import moment from "moment";
import { AppTranslateService } from "../services/translate/translate.service";
import { DIRECTION } from "../constantes/Constantes";

@Pipe({ name: "dhf" })
export class DateFormatheurePipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    if (!value) {
      return "-";
    }

    const format =
      AppTranslateService.getStoredDirection() === DIRECTION.RTL
        ? "YYYY/MM/DD HH:mm"
        : "DD/MM/YYYY HH:mm";

    const date = moment.isMoment(value) ? value : moment(value);

    return date.isValid() ? date.format(format) : "-";
  }
}
