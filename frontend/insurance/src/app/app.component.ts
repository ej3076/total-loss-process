import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  darkMode = false;
  constructor(public auth: AuthService) {}
  ngOnInit() {
    if (window.localStorage.getItem('auth')) {
      this.auth.login();
    }
  }

  changeTheme() {
    this.darkMode = !this.darkMode;
  }
}
