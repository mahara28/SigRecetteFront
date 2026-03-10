import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'mc-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb implements OnInit {
  @Input() isPrivateLayout = false;
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
  includeDefaultChildRoute(route: any) {
    if (route.route.children) {
      for (const r of route.route.children) {
        if (r.path === '') {
          return true;
        }
      }
    }
    return false;
  }
  print(parent: Breadcrumb) {
    return;
  }
}
