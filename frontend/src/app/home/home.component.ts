import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MiddlewareService } from '../middleware/middleware.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  midObj = {};

  constructor(private auth: AuthService, private middleware: MiddlewareService) {}

  ngOnInit() {}

  isAuthenticated(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    return false;
  }

  generateKeypair(): void {
    this.middleware.generateKeypair().subscribe(keypair => {
      console.log(keypair);
      this.midObj = { ...this.midObj, keypair };
    });
  }
  get(): void {
    this.middleware.checkGet().subscribe(middleware => {
      this.midObj = middleware;
      console.log(this.midObj);
    });
  }
  post(): void {
    this.middleware.checkPost().subscribe(middleware => {
      this.midObj = middleware;
      console.log(this.midObj);
    });
  }
  put(): void {
    this.middleware.checkPut().subscribe(middleware => {
      this.midObj = middleware;
      console.log(this.midObj);
    });
  }
  delete(): void {
    this.middleware.checkDelete().subscribe(middleware => {
      this.midObj = middleware;
      console.log(this.midObj);
    });
  }
}
