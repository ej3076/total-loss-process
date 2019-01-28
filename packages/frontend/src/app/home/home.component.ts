import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService) { 
  }

  ngOnInit() {
  }

  isAuthenticated(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    return false;
  }
}
