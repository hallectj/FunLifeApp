import { Component } from '@angular/core';
import { IToy } from '../../../app/models/shared-models';
import { GeneralService } from '../../../app/services/general.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-toys',
  templateUrl: './toys.component.html',
  styleUrls: ['./toys.component.scss']
})
export class ToysComponent {
  public toys: IToy[] = [];
  public randomYear: string = "1990";

  constructor(public service: GeneralService){}

  public async ngOnInit(){
    this.randomYear = (Math.floor(Math.random() * (2020 - 1950 + 1) + 1950)).toString();
    this.toys = await firstValueFrom(this.service.getToys());
  }
}
