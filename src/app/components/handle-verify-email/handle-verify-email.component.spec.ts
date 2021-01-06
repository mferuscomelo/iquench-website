import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleVerifyEmailComponent } from './handle-verify-email.component';

describe('HandleVerifyEmailComponent', () => {
  let component: HandleVerifyEmailComponent;
  let fixture: ComponentFixture<HandleVerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleVerifyEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
