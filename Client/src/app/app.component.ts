import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from './services/breadcrumb.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fun_life_app';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {

    // initialize breadcrumb to nothing
    this.breadcrumbService.setBreadcrumb([]);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });
  }

  private updateBreadcrumb(): void {
    const breadcrumb: {valid_urls: string, long_urls: string}[] = [];
    let currentRoute = this.activatedRoute.root;
    do {
      const childrenRoutes = currentRoute.children;
      currentRoute = null;
      childrenRoutes.forEach((route) => {
        if (route.outlet === 'primary') {
          const routeSnapshot = route.snapshot;
          if (routeSnapshot.data && routeSnapshot.data['breadcrumb']) {
            const myObj = route.snapshot.params;
            const valid_urls: string[] = route.snapshot.data['valid_urls'];
            const long_urls: string[] = route.snapshot.data['long_urls'];
            if(valid_urls && valid_urls.length > 0){
              let replacedUrls = valid_urls.map(url => {
                for (let key in myObj) {
                  if (myObj.hasOwnProperty(key)) {
                    url = url.replace(`:${key}`, myObj[key]);
                  }
                }
                return url;
              });

              let replaceLongUrls = long_urls.map(url => {
                for (let key in myObj) {
                  if (myObj.hasOwnProperty(key)) {
                    url = url.replace(`:${key}`, myObj[key]);
                  }
                }
                return url;
              });

              breadcrumb.push({valid_urls: replacedUrls.join(" > "), long_urls: replaceLongUrls.join(" > ")});
            }
          }
          currentRoute = route;
        }
      });
    } while (currentRoute);
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }
}
