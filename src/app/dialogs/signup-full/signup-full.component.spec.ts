import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupFullComponent } from './signup-full.component';

describe('SignupFullComponent', () => {
  let component: SignupFullComponent;
  let fixture: ComponentFixture<SignupFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
