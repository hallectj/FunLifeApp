import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { deslugify } from '../Toolbox/util';
import { Subscription, firstValueFrom } from 'rxjs';
import { ReloadService } from '../../../app/services/reload.service';
import { IPostExcerpt } from '../../../app/models/shared-models';

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
    excerptImageB64: "",
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

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    public postService: PostService, 
    public reloadService: ReloadService, 
    public sanitize: DomSanitizer, 
    private title: Title,
    private meta: Meta
  ){}

  public async ngOnInit(){
    this.randomYear = (Math.floor(Math.random() * (2020 - 1950 + 1) + 1950)).toString();  
    this.allExcerpts = await firstValueFrom(this.postService.getAllPosts());

    this.route.paramMap.subscribe(async (params) => {
      this.blogTitle = deslugify(params.get('postTitle'));
      this.title.setTitle(this.blogTitle);
      const postId = params.get("postId");
      const idx = this.allExcerpts.findIndex(v => v.postId.toString() === postId);
      if(idx !== -1){
        this.postExcerpt = this.allExcerpts[idx];
        this.meta.updateTag({name: "description", content: this.postExcerpt.excerptDesc.substring(0, 256)});
        /** SPECIAL means, we want to route the user to a component html that already exist and not the html I get from the server */
        if(this.postExcerpt.pointer.startsWith("SPECIAL")){
          const pointer = this.postExcerpt.pointer;
          const startIdx = pointer.indexOf("SPECIAL") + "SPECIAL".length;
          const localURL = pointer.substring(startIdx+1, pointer.length).trim();
          const route = [localURL];
          this.router.navigate(route);
          return;
        }

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
