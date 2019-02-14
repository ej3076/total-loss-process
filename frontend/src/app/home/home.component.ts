import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MiddlewareService } from '../middleware/middleware.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  midObj = {};
  user: User;

  constructor(
    public auth: AuthService,
    private middleware: MiddlewareService,
  ) {}

  ngOnInit() {
    if (this.auth.loggedIn) {
      console.log(this.auth.userProfile);
      this.user = this.auth.userProfile;
    }
  }
}
