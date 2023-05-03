import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellMainComponent } from './sell-main.component';

describe('SellMainComponent', () => {
  let component: SellMainComponent;
  let fixture: ComponentFixture<SellMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
