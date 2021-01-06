import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleRecoverEmailComponent } from './handle-recover-email.component';

describe('HandleRecoverEmailComponent', () => {
  let component: HandleRecoverEmailComponent;
  let fixture: ComponentFixture<HandleRecoverEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleRecoverEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleRecoverEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
