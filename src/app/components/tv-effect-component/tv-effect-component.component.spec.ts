import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvEffectComponentComponent } from './tv-effect-component.component';

describe('TvEffectComponentComponent', () => {
  let component: TvEffectComponentComponent;
  let fixture: ComponentFixture<TvEffectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvEffectComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvEffectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
