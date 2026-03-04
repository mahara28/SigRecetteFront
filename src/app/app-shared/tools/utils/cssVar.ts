import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function getCssVar(propertyName: string): string {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return '';
  }

  if (!propertyName.startsWith('--')) {
    propertyName = `--${propertyName}`;
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();
}

export function setCssVar(propertyName: string, value: string): string {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return '';
  }

  if (!propertyName.startsWith('--')) {
    propertyName = `--${propertyName}`;
  }

  if (value) {
    document.documentElement.style.setProperty(propertyName, value);
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();
}
