import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetaillComponent } from './user-detaill.component';

describe('UserDetaillComponent', () => {
  let component: UserDetaillComponent;
  let fixture: ComponentFixture<UserDetaillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetaillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetaillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
