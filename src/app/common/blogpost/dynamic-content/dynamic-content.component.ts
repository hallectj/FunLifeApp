import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';
import { ReloadService } from 'src/app/services/reload.service';

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

  constructor(public service: PostService, public reloadService: ReloadService){}

  public async ngOnInit(){
    this.subscription.add(this.reloadService.getReloadTrigger().subscribe(async (postExcerpt: IPostExcerpt) => {
      await this.loadArticle(postExcerpt.postID);
    }));
  }

  public async loadArticle(postId: number){
    this.contentIsLoading = true;
    const content = await this.service.getPost(postId).toPromise();
    this.exampleHTML = content.id.toString() + " | " + content.body;
    this.contentIsLoading = false;
  }

  public ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
