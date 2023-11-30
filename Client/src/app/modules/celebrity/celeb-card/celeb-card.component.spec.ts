import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebCardComponent } from './celeb-card.component';

describe('CelebCardComponent', () => {
  let component: CelebCardComponent;
  let fixture: ComponentFixture<CelebCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CelebCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelebCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
