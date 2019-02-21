import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { MiddlewareService } from '../middleware/middleware.service';
import { AuthService } from '../auth/auth.service';

const STYLES = {
  paper: {
    display: 'block',
    margin: '.5em',
    padding: '1em',
  },
  noClaims: {
    display: 'block',
    margin: '3rem auto auto auto',
    padding: '1em',
  }
};

@Component({
  selector: 'app-view-claims',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss'],
})
export class ViewClaimsComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);

  private claims: Protos.Claim[] = [];
  private claims0: Protos.Claim[] = [];
  private claims1: Protos.Claim[] = [];
  private claims2: Protos.Claim[] = [];
  private claims3: Protos.Claim[] = [];
  private responseError: boolean;
  private errorText: string;

  constructor(
    private _theme: LyTheme2,
    private middlewareService: MiddlewareService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.setClaims();
    }
  }

  setClaims(): void {
    this.middlewareService.getClaims().subscribe(
      result => { this.claims = [...result]; },
      error => {
        this.responseError = true;
        this.errorText = error;
      },
      () => {});
  }

  sortClaims(num): void{
    var i: number;
    for(i = num - 1; i >= 0; i--){
      if(this.claims[i].status == 0){
        console.log("I got one!");
        this.claims0.push(this.claims[i])
      }
      if(this.claims[i].status == 1){
        this.claims1.push(this.claims[i])
      }
      if(this.claims[i].status == 2){
        this.claims2.push(this.claims[i])
      }
      if(this.claims[i].status == 3){
        this.claims3.push(this.claims[i])
      }
    }
  }
}
