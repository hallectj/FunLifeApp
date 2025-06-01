import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageComponent } from './common/page/page.component';
import { BlogpostComponent } from './common/blogpost/blogpost.component';
import { BirthdayComponent } from './modules/birthday/birthday.component';
import { DayInHistoryComponent } from './modules/day-in-history/day-in-history.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { OtherComponent } from './common/other/other.component';
import { DateRouteResolver, SingleRouteResolver, ArtistRouteResolver } from './common/resolvers/resolver.resolver';
import { CelebrityPageComponent } from './modules/celebrity/celebrity-page/celebrity-page.component';
import { CelebrityComponent } from './modules/celebrity/celebrity.component';
import { HotHundredArtistComponent } from './modules/hot-hundred-main/hot-hundred-artist/hot-hundred-artist.component';
import { HotHundredCardsComponent } from './modules/hot-hundred-main/hot-hundred-cards/hot-hundred-cards.component';
import { HotHundredMainComponent } from './modules/hot-hundred-main/hot-hundred-main.component';
import { HotHundredSongComponent } from './modules/hot-hundred-main/hot-hundred-song/hot-hundred-song.component';
import { HotHundredYearComponent } from './modules/hot-hundred-main/hot-hundred-year/hot-hundred-year.component';
import { PresidentComponent } from './modules/president/president.component';
import { ToysComponent } from './modules/toys/toys.component';

const routes: Routes = [
  { 
    path: '', pathMatch: 'full', component: PageComponent, 
    data: { 
      breadcrumb: "Home",
      valid_urls: [],
      long_urls: []
    } 
  },
  { 
    path: 'page/:pageId', component: PageComponent, 
    data: { 
      breadcrumb: 'page > :pageId',
      valid_urls: ["Home", "page/:pageId"] ,
      long_urls: ["/", "page/:pageId"]
    } 
  },
  { 
    path: 'page/:pageId/:postTitle', component: BlogpostComponent, 
    data: { 
      breadcrumb: 'page > :pageId > :postTitle',
      valid_urls: ["Home", "page/:pageId", ":postTitle"],
      long_urls: ["/", "page/:pageId", "page/:pageId/:postTitle"]
    } 
  },
  { 
    path: 'posts/:postId/:postTitle', component: BlogpostComponent, 
    data: { 
      breadcrumb: 'Posts > :postId > :postTitle',
      valid_urls: ["Home", "posts/:postId/:postTitle"],
      long_urls: ["/", "posts/:postId/:postTitle"]
    } 
  },
  { 
    path: 'birthday', component: BirthdayComponent, 
    data: { 
      breadcrumb: 'Birthday Song Finder',
      valid_urls: ["Home", "birthday"],
      long_urls: ["/", "birthday"]
    } 
  },
  { 
    path: 'number-one-song-on-birthday', redirectTo: 'birthday', pathMatch: 'full'
  },
  { 
    path: 'famous-people-born-this-day', redirectTo: 'birthday', pathMatch: 'full'
  },
  { 
    path: 'day-in-history/:month/:day',
    component: DayInHistoryComponent,
    data: { 
      breadcrumb: 'Day-in-History > :month > :day',
      valid_urls: ["Home", "Day-in-History/:month-:day"],
      long_urls: ["/", "Day-in-History/:month/:day"]
    },
    resolve: {
      dateData: DateRouteResolver
    }
  },
  { 
    path: 'celebrity/:celebName', 
    component: CelebrityPageComponent, 
    data: {
      paramName: 'celebName', resolveFunction: 'getTrueCelebName', 
      breadcrumb: 'Celebrity > :celebName',
      valid_urls: ["Home", "Celebrity", ":celebName"],
      long_urls: ["/", "celebrity", "celebrity/:celebName"]
    }, 
    resolve: {exists: SingleRouteResolver}
  },
  {
    path: 'president/:presidentName',
    component: PresidentComponent,
    data: {
      paramName: 'presidentName', resolveFunction: 'getTruePresidentName', 
      breadcrumb: 'President > :presidentName',
      valid_urls: ["Home", "president/:presidentName"],
      long_urls: ["/", "president/:presidentName"]
    },
    resolve: {exists: SingleRouteResolver}
  },
  {
    path: 'charts',
    component: HotHundredMainComponent,
    children: [
      { 
        path: '', redirectTo: 'hot-hundred-songs', pathMatch: 'full', 
      },
      { 
        path: 'hot-hundred-songs', component: HotHundredCardsComponent, 
        data: { 
          breadcrumb: 'Charts > Hot-Hundred-Songs',
          valid_urls: ["Home", "charts/hot-hundred-songs"],
          long_urls: ["/", "charts/hot-hundred-songs"]
        }
      },
      { 
        path: 'hot-hundred-songs/:year/:position/artist/:artist/song/:song', 
        component: HotHundredSongComponent,
        data: { 
          breadcrumb: 'Charts > Hot-Hundred-Songs > :year > :position > :artist > :song',
          valid_urls: ["Home", "charts/hot-hundred-songs", ":year", ":year/:position/artist/:artist/song/:song"],
          long_urls: ["/", "charts/hot-hundred-songs", "charts/hot-hundred-songs/:year", "charts/hot-hundred-songs/:year/:position/artist/:artist/song/:song"]
        }
      },
      { 
        path: 'hot-hundred-songs/:year', 
        component: HotHundredYearComponent,
        data: { 
          breadcrumb: 'Charts > Hot-Hundred-Songs > :year',
          valid_urls: ["Home", "charts/hot-hundred-songs", ":year"],
          long_urls: ["/", "charts/hot-hundred-songs", "charts/hot-hundred-songs/:year"]
        } 
      },
      { 
        path: 'hot-hundred-songs/artist/:artist', 
        component: HotHundredArtistComponent,
        data: {
          paramName: 'artist', resolveFunction: 'getTrueArtistName',
          breadcrumb: "Charts > Hot-Hundred-Songs > :artist",
          valid_urls: ["Home", "charts/hot-hundred-songs", ":artist"],
          long_urls: ["/", "charts/hot-hundred-songs", "charts/hot-hundred-songs/:artist"]
        },
        resolve: {exist: ArtistRouteResolver} 
      },
    ],
  },
  { 
    path: 'celebrity', component: CelebrityComponent, 
    data: { 
      breadcrumb: 'Celebrity',
      valid_urls: ["Home", "Celebrity"],
      long_urls: ["/", "celebrity"]
    } 
  },
  { 
    path: 'toys', component: ToysComponent, 
    data: { breadcrumb: 'Toys' } },
  { 
    path: 'sitemap.xml', redirectTo: 'assets/sitemap.xml', pathMatch: 'full' },
  { 
    path: 'other', component: OtherComponent, 
    data: { breadcrumb: "Other" } },
  { 
    path: '404', component: NotFoundComponent 
  },
  { 
    path: '**', component: NotFoundComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
