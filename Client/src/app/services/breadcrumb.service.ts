import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private breadcrumbSubject = new BehaviorSubject<{valid_urls: string, long_urls: string}[]>([]);

  getBreadcrumb(): BehaviorSubject<{valid_urls: string, long_urls: string}[]> {
    return this.breadcrumbSubject;
  }

  setBreadcrumb(breadcrumb: {valid_urls: string, long_urls: string}[]): void {
    this.breadcrumbSubject.next(breadcrumb);
  }

}
