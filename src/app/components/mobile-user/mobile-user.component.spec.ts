import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileUserComponent } from './mobile-user.component';

describe('MobileUserComponent', () => {
  let component: MobileUserComponent;
  let fixture: ComponentFixture<MobileUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
