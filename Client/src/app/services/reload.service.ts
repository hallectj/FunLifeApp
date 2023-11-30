import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IPostExcerpt } from '../models/shared-models';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private reloadSubject = new Subject<IPostExcerpt>();

  triggerReload(routeTo: IPostExcerpt) {
    this.reloadSubject.next(routeTo);
  }

  getReloadTrigger() {
    return this.reloadSubject.asObservable();
  }
}