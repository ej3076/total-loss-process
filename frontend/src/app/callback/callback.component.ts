import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router, private cookie: CookieService) { }

  ngOnInit() {
    this.auth.handleAuthentication();

    this.auth.saveUserSession();

    this.router.navigate(['']);
  }

}
