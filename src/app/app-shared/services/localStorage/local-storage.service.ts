import { Injectable, Inject } from '@angular/core';  
import { PLATFORM_ID } from '@angular/core';  
import { isPlatformBrowser } from '@angular/common';  
 
@Injectable({ providedIn: 'root' })  
export class LocalStorageService {  
  private isBrowser: boolean;  
 
  constructor(@Inject(PLATFORM_ID) platformId: Object) {  
    this.isBrowser = isPlatformBrowser(platformId); // Cache the check  
  }  
 
  // Wrapper for localStorage.getItem  
  getItem(key: string): string | null {  
    if (this.isBrowser) {  
      return localStorage.getItem(key);  
    }  
    return null;  
  }  
 
  // Wrapper for localStorage.setItem  
  setItem(key: string, value: string): void {  
    if (this.isBrowser) {  
      localStorage.setItem(key, value);  
    }  
  }  
 
  // Wrapper for localStorage.removeItem  
  removeItem(key: string): void {  
    if (this.isBrowser) {  
      localStorage.removeItem(key);  
    }  
  }  
} 