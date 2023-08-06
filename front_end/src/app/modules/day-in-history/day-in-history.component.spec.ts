import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayInHistoryComponent } from './day-in-history.component';

describe('DayInHistoryComponent', () => {
  let component: DayInHistoryComponent;
  let fixture: ComponentFixture<DayInHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
