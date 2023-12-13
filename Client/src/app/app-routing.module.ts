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
import { SitemapComponent } from './common/sitemap/sitemap.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: PageComponent, data: { breadcrumb: "Home" } },
  { path: 'page/:pageId', component: PageComponent, 
    data: { breadcrumb: 'page > :pageId' } 
  },
  { path: 'page/:pageId/:postTitle', component: BlogpostComponent, 
    data: { breadcrumb: 'page > :pageId > :postTitle' } 
  },
  { path: 'posts/:postId/:postTitle', component: BlogpostComponent, 
    data: { breadcrumb: 'Posts > :postId > postTitle' } 
  },
  { path: 'birthday', component: BirthdayComponent, data: { breadcrumb: 'Birthday' } },
  { 
    path: 'day-in-history/:month/:day',
    component: DayInHistoryComponent,
    data: { breadcrumb: 'Day-in-History > :month > :day' },
    resolve: {
      dateData: DateRouteResolver
    }
  },
  { 
    path: 'celebrity/:celebName', 
    component: CelebrityPageComponent, 
    data: {paramName: 'celebName', resolveFunction: 'getTrueCelebName', 
      breadcrumb: 'Celebrity > :celebName'
    }, 
    resolve: {exists: SingleRouteResolver}
  },
  {
    path: 'president/:presidentName',
    component: PresidentComponent,
    data: {paramName: 'presidentName', resolveFunction: 'getTruePresidentName', 
      breadcrumb: 'President > :presidentName'
    },
    resolve: {exists: SingleRouteResolver}
  },
  {
    path: 'charts',
    component: HotHundredMainComponent,
    children: [
      { path: '', redirectTo: 'hot-hundred-songs', pathMatch: 'full' },
      { path: 'hot-hundred-songs', component: HotHundredCardsComponent, 
        data: { breadcrumb: 'Charts > Hot-Hundred-Songs' }
      },
      { 
        path: 'hot-hundred-songs/:year/:position/artist/:artist/song/:song', 
        component: HotHundredSongComponent,
        data: { breadcrumb: 'Charts > Hot-Hundred-Songs > :year > :position > :artist > :song' }
      },
      { 
        path: 'hot-hundred-songs/:year', 
        component: HotHundredYearComponent,
        data: { breadcrumb: 'Charts > Hot-Hundred-Songs > :year' } 
      },
      { 
        path: 'hot-hundred-songs/artist/:artist', 
        component: HotHundredArtistComponent,
        data: {paramName: 'artist', resolveFunction: 'getTrueArtistName',
          breadcrumb: "Charts > Hot-Hundred-Songs > :artist"
        },
        resolve: {exist: ArtistRouteResolver} 
      },
    ],
  },
  { path: 'celebrity', component: CelebrityComponent, data: { breadcrumb: 'Celebrity' }  },
  { path: 'toys', component: ToysComponent, data: { breadcrumb: 'Toys' } },
  { path: 'other', component: OtherComponent, data: { breadcrumb: "Other" } },
  { path: 'sitemap.xml', component: SitemapComponent },
  { path: '404', component: NotFoundComponent, data: { breadcrumb: 'Not Found' }  },
  { path: '**', component: NotFoundComponent, data: { breadcrumb: 'Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
