import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { MiddlewareService } from '../middleware/middleware.service';
import { AuthService } from '../auth/auth.service';
import { LySnackBarDismiss } from '@alyle/ui/snack-bar';
import { LySnackBarModule } from '@alyle/ui/snack-bar';

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

  private claims: Protos.Claim[];
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

  afterDismissed(e: LySnackBarDismiss) {
    console.log(e);
  }

  setClaims(): void {
    this.middlewareService.getClaims().subscribe(
      result => { this.claims = result; },
      error => { 
        this.responseError = true; 
        this.errorText = error;
      },
      () => {});
  }

  openSnackBar() {

    
  }
}
