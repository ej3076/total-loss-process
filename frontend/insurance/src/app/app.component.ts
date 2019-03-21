import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  darkMode: boolean = false;
  constructor(public auth: AuthService) {}
  ngOnInit() {
    if (window.localStorage.getItem('auth')) {
      this.auth.login();
    }
  }

  changeTheme() {
    console.log('Hello!');
    this.darkMode = !this.darkMode;
  }
}
