import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PostService } from '../../../../app/services/post.service';
import { ReloadService } from '../../../services/reload.service';
import { IPostExcerpt } from '../../../models/shared-models';

@Component({
  selector: 'dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicContentComponent {
  public exampleHTML = "";
  public contentIsLoading: boolean = false;
  public subscription: Subscription = new Subscription();
  @Input() isContentLoaded: boolean = false;
  @Input() postId: number = -1;
  @Output() postIdChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() isContentLoadedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('postContent', { static: true }) postContent: ElementRef;

  constructor(public service: PostService, public reloadService: ReloadService, public sanitizer: DomSanitizer){}

  public async ngOnInit(){
    this.subscription.add(this.reloadService.getReloadTrigger().subscribe(async (postExcerpt: IPostExcerpt) => {
      await this.loadArticle(postExcerpt.postId);
    }));
  }

  public async loadArticle(postId: number){
    this.contentIsLoading = true;
    const htmlContent = (await this.service.getPost(postId, true).toPromise()) as string;
    this.exampleHTML = (this.sanitizer.bypassSecurityTrustHtml(htmlContent)) as string;
    this.contentIsLoading = false;
  }

  public ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
