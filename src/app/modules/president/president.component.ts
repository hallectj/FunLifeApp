import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Location } from '@angular/common';
import { deslugify } from 'src/app/common/Toolbox/util';
import { IPresident } from 'src/app/models/shared-models';

@Component({
  selector: 'president',
  templateUrl: './president.component.html',
  styleUrls: ['./president.component.scss']
})
export class PresidentComponent {
  public wrappedText: string = "";
  public extractString: string = "";
  public wikiURL = "https://en.wikipedia.org/wiki/";
  public president: IPresident = {
    number: "",
    name: "",
    startDate: "",
    endDate: "",
    portraitURL: "",
    portraitDesc: "",
    portraitSource: "",
    party: "",
    birthCity: "",
    birthStateAbbr: "",
    birthdate: "",
    spouses: []
  }

  constructor(public service: GeneralService, private route: ActivatedRoute, private router: Router, public location: Location){} 

  ngOnInit(){
    this.route.paramMap.subscribe(async params => {
      const presName = deslugify(params.get('presidentName'));

      let arr = await this.service.getTruePresidentName(presName).toPromise();
      const truePresName = (arr.length > 0) ? arr[0] : presName;
      const presidents = await this.service.getPresidents().toPromise();

      const presIdx = presidents.findIndex(v => v.name === truePresName);
      if(presIdx !== -1){
        this.president = presidents[presIdx];
      }

      this.president.number = this.addNumberSuffix(+this.president.number)

      const response = await this.service.callWikiAPIPerson(this.president.name).toPromise();
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
          this.wikiURL += this.president.name.replace(/\s/g, "_");
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

  private addNumberSuffix(number: number) {
    let suffix = "";
    if (number >= 10 && number <= 20) {
        suffix = "th";
    } else {
        const lastDigit = number % 10;
        if (lastDigit === 1) {
            suffix = "st";
        } else if (lastDigit === 2) {
            suffix = "nd";
        } else if (lastDigit === 3) {
            suffix = "rd";
        } else {
            suffix = "th";
        }
    }

    return number + suffix;
  }
}
