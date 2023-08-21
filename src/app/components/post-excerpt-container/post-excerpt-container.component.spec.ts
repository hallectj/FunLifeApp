import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostExcerptContainerComponent } from './post-excerpt-container.component';

describe('PostExcerptContainerComponent', () => {
  let component: PostExcerptContainerComponent;
  let fixture: ComponentFixture<PostExcerptContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostExcerptContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostExcerptContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
