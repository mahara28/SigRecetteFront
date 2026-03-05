import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mc-cover',
  imports: [],
  templateUrl: './cover.html',
  styleUrl: './cover.css',
})
export class Cover implements OnInit {
  @Input() avatar = defaultAvatar;
  @Input() cover = defaultCover;
  @Input() lastName?: string;
  @Input() firstName?: string;

    constructor() {
    }

    ngOnInit(): void {
    }


}
