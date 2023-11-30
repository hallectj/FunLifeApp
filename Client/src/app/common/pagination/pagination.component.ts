import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  constructor(private router: Router) {}

  @Input() pageNumber: number = 1;
  @Output() pageNumberChange: EventEmitter<number> = new EventEmitter<number>();
  public currentPage: number = 1;

  public pageRange(number: number): number[] {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  public prevPage($event: Event) {
    $event.preventDefault();
    this.pageNumber -= 1;
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    }
    this.currentPage = this.pageNumber;
    this.pageNumberChange.emit(this.pageNumber);
    this.navigateWithPageNumber();
  }

  public clickNumberedPage($event: Event, page: number) {
    $event.preventDefault();
    this.pageNumber = page;
    this.currentPage = page;
    this.pageNumberChange.emit(this.pageNumber);
    this.navigateWithPageNumber();
  }

  public nextPage($event: Event) {
    $event.preventDefault();
    this.pageNumber += 1;
    if (this.pageNumber > 5) {
      this.pageNumber = 5;
    }
    this.currentPage = this.pageNumber;
    this.pageNumberChange.emit(this.pageNumber);
    this.navigateWithPageNumber();
  }

  private navigateWithPageNumber() {
    this.router.navigate(['/page', this.pageNumber]);
  }
}
