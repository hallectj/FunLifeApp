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
  public mainAttribution: string = "";
  public postExcerpt: IPostExcerpt = {
    postId: -1,
    excerptDesc: "",
    excerptImage: "",
    excerptTitle: "",
    author: "",
    dateWritten: null,
    lastUpdated: null,
    isFeaturePost: false,
    pointer: "",
    attribution: {
      license: "",
      author: "",
      imageURL: "",
      via: ""
    }
  }
  public subscription: Subscription = new Subscription();
  public isContentLoaded: boolean = false;
  public allExcerpts: IPostExcerpt[] = [];
  public randomYear: string = "1999";

  @ViewChild('postContent', { static: true }) postContent: ElementRef;

  constructor(private route: ActivatedRoute, public postService: PostService, public reloadService: ReloadService, public sanitize: DomSanitizer){}

  public async ngOnInit(){
    this.randomYear = (Math.floor(Math.random() * (2020 - 1950 + 1) + 1950)).toString();  
    this.allExcerpts = await this.postService.getAllPosts().toPromise();

    this.route.paramMap.subscribe(async (params) => {
      this.blogTitle = deslugify(params.get('postTitle'));
      const postId = params.get("postId");
      const idx = this.allExcerpts.findIndex(v => v.postId.toString() === postId);
      if(idx !== -1){
        this.postExcerpt = this.allExcerpts[idx];
        if(!!this.postExcerpt.attribution.author){
          this.mainAttribution = `
          <figcaption class='source'>
            Image Source: <cite><a href='${this.postExcerpt.attribution.imageURL}'>${this.postExcerpt.attribution.author}</a></cite>
            <a href="${this.postExcerpt.attribution.license}">License</a> via ${this.postExcerpt.attribution.via}
          </figcaption> 
        `
        }

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        this.reloadService.triggerReload(this.postExcerpt);      
      }
    })
  }

  public ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
