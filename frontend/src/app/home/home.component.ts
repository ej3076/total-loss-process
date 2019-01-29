import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MidwareService } from '../midware/midware.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  midObj: Object = null;

  constructor(private auth: AuthService, private midware: MidwareService) { 
  }

  ngOnInit() {
  }

  isAuthenticated(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    return false;
  }

  get(): void {
    this.midware.checkGet().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    })
   }   
  post(): void { 
    this.midware.checkPost().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    })
  }
  put(): void {
    this.midware.checkPut().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    })
   }
  delete(): void { 
    this.midware.checkDelete().subscribe(midware => {
      this.midObj = midware;
      console.log(this.midObj);
    })
  }
}
