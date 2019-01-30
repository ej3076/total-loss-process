import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MidwareService } from '../midware/midware.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  midObj = {};

  constructor(private auth: AuthService, private midware: MidwareService) {}

  ngOnInit() {}

  isAuthenticated(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    return false;
  }

  generateKeypair(): void {
    this.midware.generateKeypair().subscribe(keypair => {
      console.log(keypair);
      this.midObj = { ...this.midObj, keypair };
    });
  }
  get(): void {
    this.midware.checkGet().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    });
  }
  post(): void {
    this.midware.checkPost().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    });
  }
  put(): void {
    this.midware.checkPut().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    });
  }
  delete(): void {
    this.midware.checkDelete().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    });
  }
}
