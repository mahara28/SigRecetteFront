import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "mf" })
export class MinutesFormatPipe implements PipeTransform {
  transform(milliseconds: number): string {
    if (!milliseconds || milliseconds < 0) return " - ";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return minutes !== 0 ? `${minutes} min ${seconds} sec` : `${seconds} sec`;
  }
}
