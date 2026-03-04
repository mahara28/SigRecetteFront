import { Injectable, HostListener } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { AuthentificationUri } from '../../uri/authentification-uri-index';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  constructor(private authService: AuthentificationService) {}

@HostListener('window:beforeunload', ['$event'])
beforeUnload(event: BeforeUnloadEvent) {
    console.log('Before unload triggered'); 
    
    const userJson = localStorage.getItem("userInfo");
    const token = sessionStorage.getItem("access_token");

    if (!userJson || !token) return;

    const user = JSON.parse(userJson);

    console.log('Sending beacon to logout with user ID:', user.id); 

    navigator.sendBeacon(
      AuthentificationUri.LOGOUT + user.id
    );
}

}
