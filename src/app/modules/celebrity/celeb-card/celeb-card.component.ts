import { Component, Input } from '@angular/core';

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

  constructor(){}

  public ngOnInit(){

  }
}
