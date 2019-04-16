import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClaimsComponent } from './view-claims.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule, MatSortModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';

describe('ViewClaimsComponent', () => {
  let component: ViewClaimsComponent;
  let fixture: ComponentFixture<ViewClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        RouterModule,
        RouterTestingModule,
        MatSortModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [AuthService, MiddlewareService],
      declarations: [ViewClaimsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
