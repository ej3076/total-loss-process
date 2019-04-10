import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimSharedComponent } from './edit-claim.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatTableModule,
  MatDialog,
  MatDialogModule,
  MatSnackBarModule,
} from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OVERLAY_PROVIDERS } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditClaimSharedComponent', () => {
  let component: EditClaimSharedComponent;
  let fixture: ComponentFixture<EditClaimSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatTableModule,
        MatDialogModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      declarations: [EditClaimSharedComponent],
      providers: [
        MatDialog,
        HttpClient,
        HttpHandler,
        AuthService,
        OVERLAY_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClaimSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
