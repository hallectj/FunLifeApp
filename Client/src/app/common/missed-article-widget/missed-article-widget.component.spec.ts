import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedArticleWidgetComponent } from './missed-article-widget.component';

describe('MissedArticleWidgetComponent', () => {
  let component: MissedArticleWidgetComponent;
  let fixture: ComponentFixture<MissedArticleWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissedArticleWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissedArticleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
