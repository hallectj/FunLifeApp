import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';
import { slugify } from '../Toolbox/util';
import { ReloadService } from 'src/app/services/reload.service';

@Component({
  selector: 'missed-article-widget',
  templateUrl: './missed-article-widget.component.html',
  styleUrls: ['./missed-article-widget.component.scss']
})
export class MissedArticleWidgetComponent {
  public dummyPostsExcerpts: IPostExcerpt[] = [];
  public inCaseYouMissedArr: IPostExcerpt[] = [];
  public selectedArticle: IPostExcerpt = {
    postID: -1,
    excerptImage: "",
    excerptTitle: "",
    excerptDesc: "",
    isFeaturePost: false
  }
  constructor(public postService: PostService, public reloadService: ReloadService, private router: Router){}

  public async ngOnInit(){
    this.dummyPostsExcerpts = await this.postService.getDummyPostsExcerpts().toPromise();
    this.populateInCaseYouMissed();
  }

  public goToPost(article: IPostExcerpt){
    this.selectedArticle = article;
    this.router.navigate(['/post/' + slugify(this.selectedArticle.excerptTitle)]);
    this.populateInCaseYouMissed();
  }

  public populateInCaseYouMissed(){
    const randLen = (this.dummyPostsExcerpts.length >= 3) ? 3 : this.dummyPostsExcerpts.length;
    this.inCaseYouMissedArr = [];

    for (let i = 0; i < randLen; i++) {
      let idx = Math.floor(Math.random() * this.dummyPostsExcerpts.length);
      this.inCaseYouMissedArr.push(this.dummyPostsExcerpts[idx]);
    }    
  }
}
