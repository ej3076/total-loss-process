import { Component, OnInit } from '@angular/core';
import { ThemeVariables, LyTheme2 } from '@alyle/ui';
import { MiddlewareService } from 'src/app/middleware/middleware.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

const alyleStyle = (theme: ThemeVariables) => ({
  paper: {
    display: 'block',
    margin: '.2em',
    padding: '.8em',
  },
  noClaims: {
    display: 'block',
    margin: '3rem auto auto auto',
    padding: '1em',
  },
  claim: {
    padding: '16px',
    borderRadius: '4px',
  },
  claimLink: {
    color: theme.primary.default,
    '&:hover': {
      color: theme.warn.default,
    },
  },
});

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(alyleStyle);
  public appearance = new FormControl();

  public vin = '';

  public claim: Protos.Claim | undefined;

  constructor(
    private _theme: LyTheme2,
    private route: ActivatedRoute,
    private router: Router,
    private service: MiddlewareService,
  ) {
    this.appearance.setValue('outlined');
  }

  ngOnInit() {
    const vin = this.route.snapshot.paramMap.get('vin');
    if (!vin) {
      this.router.navigate(['/']);
      return;
    }
    this.vin = vin;
    this.service.getClaim(this.vin).subscribe(data => {
      this.claim = data;
    });
  }

  deleteClaim(): void {
    this.service.deleteClaim(this.vin).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      },
      () => {
        alert('SUCCESSFULLY DELETED');
      },
    );
  }

  editClaim(status: number = 0, increment: number = 0): void {
    if (this.claim) {
      const claim = {
        status: status + increment,
        vehicle: {
          vin: this.vin,
        },
      };

      if (status < 0) {
        alert('Status cannot be reversed at the first state.');
      } else if (status > 3) {
        alert('Status cannot be progressed past the final state.');
      } else {
        this.service.editClaim(claim);
      }
    }
  }
}
