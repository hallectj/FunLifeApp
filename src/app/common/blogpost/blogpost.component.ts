import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';

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
  public isContentLoaded: boolean = false;

  @ViewChild('postContent', { static: true }) postContent: ElementRef;

  constructor(private route: ActivatedRoute, public postService: PostService, public sanitize: DomSanitizer){}

  public async ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.blogTitle = this.deslugify(params.get('postTitle'));
      this.postExcerpt = this.postService.getPostExcerpt(this.blogTitle)
    })
  }

  private deslugify(title: string){
    let s = title.split("-").map(v => v.charAt(0).toUpperCase() + v.slice(1)).join("-");
    return s.replace(/-/g, " ");
  }

  public isDynamicContentLoaded(isContentLoaded: boolean){
    this.isContentLoaded = isContentLoaded;
  }
}
