import { Component } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Router } from '@angular/router';
import { IBreadcrumb } from '../../models/breadcrumb-model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  public breadcrumbs: IBreadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService, public router: Router) {}

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumb().subscribe((breadcrumb: {valid_urls: string; long_urls: string}[]) => {
      this.breadcrumbs = [];
      
      // If we're on the home page, clear breadcrumbs and return
      if (this.router.url === '/') {
        return;
      }

      let bCrumbs = breadcrumb.map(v => v.valid_urls).join("").split(">");
      let bLongs = breadcrumb.map(v => v.long_urls).join("").split(">");
      
      // Filter out duplicate "Home" entries
      let seenHome = false;
      for(let i = 0; i < bCrumbs.length; i++) {
        const lastIdx = bCrumbs[i].lastIndexOf("/");
        let route = ['/' + bLongs[i].trim()];
        const label = bCrumbs[i].substring(lastIdx + 1, bCrumbs[i].length).trim();
        
        // Skip if this is a duplicate "Home" entry
        if (label === 'Home') {
          if (seenHome) continue;
          seenHome = true;
        }

        const obj: IBreadcrumb = {
          label: label,
          url: route
        };
        
        if (!(this.breadcrumbs.length === 0 && obj.label === 'Home')) {
          this.breadcrumbs.push(obj);
        }
      }
    });
  }
}