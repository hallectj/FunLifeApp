import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { deslugify, numberWithCommas } from '../../../../app/common/Toolbox/util';
import { IBiographicalInfo } from '../../../../app/models/shared-models';
import { GeneralService } from '../../../../app/services/general.service';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'celebrity-page',
  templateUrl: './celebrity-page.component.html',
  styleUrls: ['./celebrity-page.component.scss']
})
export class CelebrityPageComponent {
  public bioGraphObj: IBiographicalInfo = {
    name: "",
    spouses: [],
    occupations: [],
    family: "",
    familyDesc: "",
    citizenship: "",
    birthPlace: "",
    image: "",
    birthDate:  "",
    followers: "0",
    qid: ""
  }

  public wrappedText: string = "";
  public extractString: string = "";
  public wikiURL = "https://en.wikipedia.org/wiki/";

  constructor(
    public service: GeneralService, 
    private route: ActivatedRoute, 
    private router: Router, 
    public location: Location, 
    private title: Title,
    private meta: Meta
  ){} 

  public async ngOnInit(){
    this.route.paramMap.subscribe(async params => {
      const celebName = deslugify(params.get('celebName'));
      this.title.setTitle(celebName);
      this.meta.updateTag({name: "description", content: "Interesting facts and information on " + celebName});

      let arr = await firstValueFrom(this.service.getTrueCelebName(celebName));
      const trueCelebName = ((arr.length > 0) && arr[0]) ? arr[0] : celebName;

      //It's possible the celeb name has quotes in it, ie 'Evander "the real deal" Holyfield'
      let escapedCelebName = trueCelebName.replace(/"/g, '\\"');

      const bioResponse = await firstValueFrom(this.service.getBiographicalInformation(escapedCelebName));
      if(!bioResponse){
        return;
      }

      this.bioGraphObj = bioResponse;
      let wikiSearchTerm = "";
      let qid = "";
      if(!!bioResponse?.qid){
        qid = bioResponse.qid;
      }

      this.bioGraphObj.followers = numberWithCommas(this.bioGraphObj.followers);

      const correctedTitle = await this.service.getCorrectedWikiTitle(qid);
      wikiSearchTerm = (correctedTitle !== "") ? correctedTitle : bioResponse.name; 
      this.bioGraphObj.name = wikiSearchTerm;

      const response = await firstValueFrom(this.service.callWikiAPITopic(wikiSearchTerm));
      const keys = Object.keys(response.query.pages)
      let paragraphs = []

      if(keys && keys[0] !== "-1"){
        this.extractString = response.query.pages[keys[0]].extract;

        const wordArr = this.extractString.split(" ");
        const length = wordArr.length;
        let n = (length < 150) ? length : 150;
  
        this.extractString = (wordArr.slice(0, n)).join(" ") + "...\n";

        paragraphs = this.extractString.split('\n');
        if(response.query.pages[keys[0]]?.canonicalurl){
          this.wikiURL = response.query.pages[keys[0]]?.canonicalurl;
        }else{
          this.wikiURL += celebName.replace(/\s/g, "_");
        }
      }

      // Wrap each paragraph in a <p> tag and add a <p> tag for the first paragraph.
      const wrappedText = paragraphs.map((paragraph, index) => {
        if (index === 0) {
          return `<p>${paragraph.trim()}</p>`;
        }
        return `<p>${paragraph.trim()}</p>`;
      }).join('\n');
      
      this.wrappedText = wrappedText;
    });
  }

  public back(): void {
    this.location.back();
  }
}
