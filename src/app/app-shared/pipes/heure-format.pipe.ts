import { Pipe, PipeTransform } from "@angular/core";
import { DateFormatPipe as MomentDateFormatPipe } from "ngx-moment";

@Pipe({ name: "hf" })
export class HeureFormatPipe implements PipeTransform {
  transform(value: any): string {
    if (!value || isNaN(value)) {
      return "-";
    }

    const totalSeconds = Number(value);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    // return `${hours !== 0 ? `${pad(hours)} (h)` : ""} ${
    //   minutes !== 0 ? `${pad(minutes)} (mn)` : ""
    // } ${pad(seconds)} (s)`;

    return `${pad(hours)} (h) ${pad(minutes)} (mn) ${pad(seconds)} (s)`;
  }
}
