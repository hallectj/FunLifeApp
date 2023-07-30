import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontFeatureComponent } from './front-feature.component';

describe('FrontFeatureComponent', () => {
  let component: FrontFeatureComponent;
  let fixture: ComponentFixture<FrontFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
