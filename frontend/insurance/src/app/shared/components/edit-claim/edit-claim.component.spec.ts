import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimSharedComponent } from './edit-claim.component';

describe('EditClaimSharedComponent', () => {
  let component: EditClaimSharedComponent;
  let fixture: ComponentFixture<EditClaimSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditClaimSharedComponent],
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
