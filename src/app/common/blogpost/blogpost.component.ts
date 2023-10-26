import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';
import { deslugify } from '../Toolbox/util';
import { Subscription } from 'rxjs';
import { ReloadService } from 'src/app/services/reload.service';

@Component({
  selector: 'blogpost',
  templateUrl: './blogpost.component.html',
  styleUrls: ['./blogpost.component.scss']
})
export class BlogpostComponent {
  public blogTitle: string = "";
  public postExcerpt: IPostExcerpt = {
    excerptDesc: "",
    excerptImage: "",
    excerptTitle: "",
    isFeaturePost: false
  }
  public subscription: Subscription = new Subscription();
  public isContentLoaded: boolean = false;

  @ViewChild('postContent', { static: true }) postContent: ElementRef;

  constructor(private route: ActivatedRoute, public postService: PostService, public reloadService: ReloadService, public sanitize: DomSanitizer){}

  public async ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.blogTitle = deslugify(params.get('postTitle'));
      this.postExcerpt = this.postService.getPostExcerpt(this.blogTitle)
    })

    this.subscription.add(this.reloadService.getReloadTrigger().subscribe((postExcerpt: IPostExcerpt) => {
      this.route.paramMap.subscribe(async (params) => {
        this.blogTitle = deslugify(params.get('postTitle'));
        this.postExcerpt = postExcerpt;
      })
    }));
  }

  public ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
