import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleLinkSigninComponent } from './handle-link-signin.component';

describe('HandleLinkSigninComponent', () => {
  let component: HandleLinkSigninComponent;
  let fixture: ComponentFixture<HandleLinkSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleLinkSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleLinkSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
