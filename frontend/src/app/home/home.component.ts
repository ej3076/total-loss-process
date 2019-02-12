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
    private auth: AuthService,
    private middleware: MiddlewareService,
  ) {}

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.user = this.auth.getUser();
    }
  }

  isAuthenticated(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    return false;
  }
}
