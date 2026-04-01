import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-messages-list',
  standalone: false,
  templateUrl: './notification-messages-list.component.html',
  styleUrls: ['./notification-messages-list.component.css']
})
export class NotificationMessagesListComponent implements OnInit {
  codeTypeNotif?: any;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.codeTypeNotif = history.state?.code;
    console.log(this.codeTypeNotif)
  }

}
