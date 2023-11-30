import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidFeatureComponent } from './mid-feature.component';

describe('MidFeatureComponent', () => {
  let component: MidFeatureComponent;
  let fixture: ComponentFixture<MidFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
