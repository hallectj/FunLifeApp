import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { Observable, Subscription, from } from 'rxjs';
import { PostService } from '../../../../app/services/post.service';
import { ReloadService } from '../../../services/reload.service';
import { IPostExcerpt } from '../../../models/shared-models';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicContentComponent implements OnChanges {
  public articleFromGitPagesHTML = "";
  public contentIsLoading: boolean = false;
  public subscription: Subscription = new Subscription();
  @Input() isContentLoaded: boolean = false;
  @Input() postId: number = -1;
  @Output() postIdChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() isContentLoadedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('postContent', { static: true }) postContent: ElementRef;

  constructor(
    public service: PostService, 
    public reloadService: ReloadService, 
    public sanitizer: DomSanitizer,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  public ngOnInit(){
    this.subscription.add(this.reloadService.getReloadTrigger().subscribe((postExcerpt: IPostExcerpt) => {
      this.loadArticle(postExcerpt.postId);
    }));
    
    // Initial load if postId is available
    if (this.postId > 0) {
      this.loadArticle(this.postId);
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // React to postId changes
    if (changes['postId'] && !changes['postId'].firstChange && this.postId > 0) {
      this.loadArticle(this.postId);
    }
  }

  public loadArticle(postId: number){
    if (postId <= 0) return;
    
    this.contentIsLoading = true;
    this.isContentLoadedChange.emit(false);
    
    // Convert to observable for consistent handling
    from(this.service.getPost(postId, true)).subscribe({
      next: (htmlContent: any) => {
        if (htmlContent) {
          this.articleFromGitPagesHTML = this.sanitizer.bypassSecurityTrustHtml(htmlContent) as string;
          this.contentIsLoading = false;
          this.isContentLoadedChange.emit(true);
        } else {
          this.handleError();
        }
      },
      error: () => this.handleError()
    });
  }
  
  private handleError() {
    this.articleFromGitPagesHTML = this.sanitizer.bypassSecurityTrustHtml(
      '<div class="error-message">Unable to load content. Please try again later.</div>'
    ) as string;
    this.contentIsLoading = false;
    this.isContentLoadedChange.emit(true);
  }
  
  public ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
