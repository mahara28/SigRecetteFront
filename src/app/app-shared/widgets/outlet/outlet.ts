import { Component, OnInit } from '@angular/core';
import { AuthentificationRoutingModule } from "../../../layouts/public/pages/authentification/authentification-routing.module";

@Component({
  selector: 'mc-outlet',
  imports: [AuthentificationRoutingModule],
  templateUrl: './outlet.html',
  styleUrl: './outlet.css',
})
export class Outlet implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
    }
}
