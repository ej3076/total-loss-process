import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authService: AuthService = null;

  constructor(private Auth: AuthService) {
    this.authService = Auth;
   }

  ngOnInit() {
    
  }

}
