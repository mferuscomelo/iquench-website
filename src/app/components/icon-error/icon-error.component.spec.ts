import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconErrorComponent } from './icon-error.component';

describe('IconErrorComponent', () => {
  let component: IconErrorComponent;
  let fixture: ComponentFixture<IconErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
