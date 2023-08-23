import { Component, Input } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;

  public pageRange(number: number): number[]{
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  public prevPage($event: Event){
    $event.preventDefault();
    this.currentPage -= 1;
    if(this.currentPage === 0){
      this.currentPage = 1;
    }
  }

  public clickNumberedPage($event: Event, page: number){
    $event.preventDefault();
    this.currentPage = page;
  }

  public nextPage($event: Event){
    $event.preventDefault();
    this.currentPage += 1;
    if(this.currentPage === 6){
      this.currentPage = 5;
    }
  }
}
