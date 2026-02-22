import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IPostExcerpt } from '../../../app/models/shared-models';
import { PostService } from '../../../app/services/post.service';
import { firstValueFrom } from 'rxjs';
import { slugify } from '../Toolbox/util';
import { ReloadService } from '../../../app/services/reload.service';

@Component({
  selector: 'missed-article-widget',
  templateUrl: './missed-article-widget.component.html',
  styleUrls: ['./missed-article-widget.component.scss']
})
export class MissedArticleWidgetComponent {
  public dummyPostsExcerpts: IPostExcerpt[] = [];
  public inCaseYouMissedArr: IPostExcerpt[] = [];
  public selectedArticle: IPostExcerpt = {
    postId: -1,
    excerptImage: "",
    excerptImageB64: "",
    excerptTitle: "",
    excerptDesc: "",
    author: "",
    dateWritten: null,
    lastUpdated: null,
    isFeaturePost: false,
    pointer: "",
    attribution: {
      author: "",
      license: "",
      imageURL: "",
      via: ""
    }
  }
  constructor(public postService: PostService, public reloadService: ReloadService, private router: Router){}

  public async ngOnInit(){
    this.dummyPostsExcerpts = await firstValueFrom(this.postService.getAllPosts());
    if(this.dummyPostsExcerpts.length > 0){
      this.dummyPostsExcerpts.forEach(v => {
        if(!v.excerptDesc.endsWith("...")){
          v.excerptDesc = v.excerptDesc.split(" ").splice(0, 20).join(" ") + "..."
        }
      })
    }
    this.populateInCaseYouMissed();
  }

  public goToPost(article: IPostExcerpt){
    this.selectedArticle = article;
    this.router.navigate(['/posts/' + article.postId + "/" + slugify(this.selectedArticle.excerptTitle)]);
    this.populateInCaseYouMissed();
  }

  public populateInCaseYouMissed(){
    if (this.dummyPostsExcerpts.length >= 3) {
      const randomPosts = [];
      const randomIndices = [];
      while (randomIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * this.dummyPostsExcerpts.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      randomIndices.forEach(index => {
        randomPosts.push(this.dummyPostsExcerpts[index]);
      });

      this.inCaseYouMissedArr = randomPosts;

    } else {
      //Not enough posts to select 3 random post
      return;
    }
  }
}