import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
