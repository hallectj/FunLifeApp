import { Inject, Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { GeneralService } from '../../services/general.service'; // Replace with your actual service
import { deslugify, isValidDate } from '../Toolbox/util';

@Injectable()
export class SingleRouteResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve: ResolveFn<boolean> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const parm = route.data['paramName'] || "";
    const name = deslugify(route.paramMap.get(parm)); 
    const resolveFunctionName = route.data['resolveFunction'];
    return this.service[resolveFunctionName](name).pipe(
      map((exists: string[]) => {
        if (exists.length > 0 && !!exists[0]) {
          return true; // Celebrity exists, resolve the route
        } else {
          // Redirect to the 404 route with the original URL as a parameter
          this.router.navigate(['/404'], {
            queryParams: { originalUrl: state.url },
          });
          return false; // Don't resolve the route
        }
      })
    );
  };
}

@Injectable()
export class ArtistRouteResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const artist = deslugify(route.paramMap.get('artist'));
    const resolveFunctionName = route.data['resolveFunction'];
    return this.service[resolveFunctionName](artist).pipe(
      map((exists: string[]) => {
        if (exists.length > 0 && !!exists[0]) {
          return true;
        } else {
          // Redirect to the 404 route with the original URL as a parameter
          this.router.navigate(['/404'], {
            queryParams: { originalUrl: state.url },
          });
          return false; // Don't resolve the route
        }
      })
    );
  }
}


@Injectable()
export class SongRouteResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const artist = route.paramMap.get('artist');
    const song = route.paramMap.get('song');
    const position = route.paramMap.get('position');
    const year = route.paramMap.get('year');

    const artistP = artist.replace(/[^a-zA-Z0-9]/g, "");
    const songP = song.replace(/[^a-zA-Z0-9]/g, "");

    const resolveFunctionName = route.data['resolveFunction'];
    return this.service[resolveFunctionName](year, position, song, artist).pipe(
      map((exists: {artist: string, song: string}[]) => {
        const artistE = exists[0].artist.replace(/[^a-zA-Z0-9]/g, "");
        const songE = exists[0].song.replace(/[^a-zA-Z0-9]/g, "");

        if (artistP === artistE && songP === songE) {
          return true;
        } else {
          // Redirect to the 404 route with the original URL as a parameter
          this.router.navigate(['/404'], {
            queryParams: { originalUrl: state.url },
          });
          return false; // Don't resolve the route
        }
      })
    );
  }
}

@Injectable()
export class DateRouteResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const month = route.paramMap.get('month');
    const day = route.paramMap.get('day');
    if (isValidDate(month, day, false, true)) {
      return of(true);
    } else {
      // Redirect to the 404 route with the original URL as a parameter
      this.router.navigate(['/404'], {
        queryParams: { originalUrl: state.url },
      });
      return of(false); // Don't resolve the route
    }
  }
}