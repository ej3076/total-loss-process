import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  darkMode = false;

  constructor(public auth: AuthService, public appComp: AppComponent) {}

  ngOnInit() {}

  themeButton() {
    this.appComp.changeTheme();
    this.darkMode = !this.darkMode;
  }
}
