import { Injectable } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Inject, Optional } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomDateAdapter extends DateAdapter<Date> {
  override getYearName(date: Date): string {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) private dateLocale: string
  ) {
    super();
    this.setLocale(dateLocale || 'en');
  }

  // Implémentation minimale requise
  getYear(date: Date): number {
    return date.getFullYear();
  }

  getMonth(date: Date): number {
    return date.getMonth();
  }

  getDate(date: Date): number {
    return date.getDate();
  }

  getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const intl = new Intl.DateTimeFormat(this.dateLocale, {
      month: style === 'narrow' ? 'narrow' : 'long',
    });
    return Array.from({ length: 12 }, (_, i) =>
      intl.format(new Date(2020, i))
    );
  }

  getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const intl = new Intl.DateTimeFormat(this.dateLocale, {
      weekday: style === 'narrow' ? 'narrow' : 'long',
    });
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2020, 0, 5 + i);
      return intl.format(date);
    });
  }

  getFirstDayOfWeek(): number {
    return 0; // Dimanche = 0
  }

  getNumDaysInMonth(date: Date): number {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return new Date(nextMonth.getTime() - 86400000).getDate();
  }

  clone(date: Date): Date {
    return new Date(date);
  }

  createDate(year: number, month: number, date: number): Date {
    const result = new Date(year, month, date);
    result.setFullYear(year);
    return result;
  }

  today(): Date {
    return new Date();
  }

  parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return null;
  }

  format(date: Date, displayFormat: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
  }

  addCalendarYears(date: Date, years: number): Date {
    return this.addCalendarMonths(date, years * 12);
  }

  addCalendarMonths(date: Date, months: number): Date {
    let newDate = this.clone(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  addCalendarDays(date: Date, days: number): Date {
    let newDate = this.clone(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  fromIso8601(iso8601String: string): Date | null {
    const d = new Date(iso8601String);
    return isNaN(d.getTime()) ? null : d;
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  invalid(): Date {
    return new Date(NaN);
  }
}
