import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrityPageComponent } from './celebrity-page.component';

describe('CelebrityPageComponent', () => {
  let component: CelebrityPageComponent;
  let fixture: ComponentFixture<CelebrityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CelebrityPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelebrityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
