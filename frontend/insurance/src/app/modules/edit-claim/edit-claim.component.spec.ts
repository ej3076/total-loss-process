import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimComponent } from './edit-claim.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditClaimComponent', () => {
  let component: EditClaimComponent;
  let fixture: ComponentFixture<EditClaimComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
