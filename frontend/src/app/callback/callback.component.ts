import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {
    auth.handleAuth();


   }

   ngOnInit() {}

   generateKeys(): void {
     
   }
}
