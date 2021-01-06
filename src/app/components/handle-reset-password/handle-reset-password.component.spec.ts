import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleResetPasswordComponent } from './handle-reset-password.component';

describe('HandleResetPasswordComponent', () => {
  let component: HandleResetPasswordComponent;
  let fixture: ComponentFixture<HandleResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
