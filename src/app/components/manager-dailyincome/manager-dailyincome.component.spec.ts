import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDailyincomeComponent } from './manager-dailyincome.component';

describe('ManagerDailyincomeComponent', () => {
  let component: ManagerDailyincomeComponent;
  let fixture: ComponentFixture<ManagerDailyincomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerDailyincomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDailyincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
