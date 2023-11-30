import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontFeatureCardComponent } from './front-feature-card.component';

describe('FrontFeatureCardsComponent', () => {
  let component: FrontFeatureCardComponent;
  let fixture: ComponentFixture<FrontFeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontFeatureCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
