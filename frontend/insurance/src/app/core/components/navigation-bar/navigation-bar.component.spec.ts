import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';
import { MatIconModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../../../app.component';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        RouterModule,
        MatToolbarModule,
        RouterTestingModule,
      ],
      providers: [AuthService, AppComponent],
      declarations: [NavigationBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the color theme', () => {
    component.darkMode = false;
    component.themeButton();

    expect(component.darkMode).toBeTruthy();
  });
});
