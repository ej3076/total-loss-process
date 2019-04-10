import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClaimComponent } from './new-claim.component';
import {
  MatFormFieldModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatCardModule,
  MatNativeDateModule,
  MatInputModule,
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewClaimComponent', () => {
  let component: NewClaimComponent;
  let fixture: ComponentFixture<NewClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatCardModule,
        RouterTestingModule,
        MatNativeDateModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [HttpClient, HttpHandler, AuthService],
      declarations: [NewClaimComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
