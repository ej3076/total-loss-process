import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimComponent } from './edit-claim.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';

describe('EditClaimComponent', () => {
  let component: EditClaimComponent;
  let fixture: ComponentFixture<EditClaimComponent>;
  // let service: MiddlewareService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [AuthService],
      declarations: [EditClaimComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClaimComponent);
    component = fixture.componentInstance;
    // service = TestBed.get(MiddlewareService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should set the claim to be edited', () => {

  // })
});
