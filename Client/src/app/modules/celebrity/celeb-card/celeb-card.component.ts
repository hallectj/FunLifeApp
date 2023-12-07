import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { slugify } from '../../../../../src/app/common/Toolbox/util';
import { GeneralService } from '../../../../../src/app/services/general.service';

@Component({
  selector: 'celeb-card',
  templateUrl: './celeb-card.component.html',
  styleUrls: ['./celeb-card.component.scss']
})
export class CelebCardComponent {
  @Input() image: string = "";
  @Input() size: string = "";
  @Input() medalColor: string = "";
  @Input() showSkills: boolean = true;
  @Input() celebPopularity: number = 0;
  @Input() celebInfo: {name: string, age: number, occupations: string[]} = {
    name: "",
    age: 0,
    occupations: []
  }

  constructor(public router: Router, public service: GeneralService, public location: Location){}

  public ngOnInit(){

  }

  public navigateToCelebrityPage(celebInfo: {name: string, age: number, occupations: string[]}){
    this.router.navigate(['/celebrity/' + slugify(celebInfo.name)])
  }
}
