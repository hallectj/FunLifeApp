import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { BirthdayComponent } from './modules/birthday/birthday.component';
import { DayInHistoryComponent } from './modules/day-in-history/day-in-history.component';
import { CelebrityComponent } from './modules/celebrity/celebrity.component';
import { InfoSidebarComponent } from './modules/info-sidebar/info-sidebar.component';
import { FrontFeatureComponent } from './components/front-feature/front-feature.component';
import { FrontFeatureCardComponent } from './components/front-feature/front-feature-card/front-feature-card.component';
import { TvEffectComponentComponent } from './components/tv-effect-component/tv-effect-component.component';
import { FooterComponent } from './common/footer/footer.component';
import { PostExcerptComponent } from './components/post-excerpt/post-excerpt.component';
import { MidFeatureComponent } from './components/mid-feature/mid-feature.component';
import { PostExcerptContainerComponent } from './components/post-excerpt-container/post-excerpt-container.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { CelebCardComponent } from './modules/celebrity/celeb-card/celeb-card.component';
import { FormsModule } from '@angular/forms';
import { RibbonComponent } from './common/ribbon/ribbon.component';
import { BlogpostComponent } from './common/blogpost/blogpost.component';
import { PageComponent } from './common/page/page.component';
import { DynamicContentComponent } from './common/blogpost/dynamic-content/dynamic-content.component';
import { MissedArticleWidgetComponent } from './common/missed-article-widget/missed-article-widget.component';
import { CelebrityPageComponent } from './modules/celebrity/celebrity-page/celebrity-page.component';
import { CelebrityExistsResolver } from './common/resolvers/celebrity-exists.resolver';
import { PresidentComponent } from './modules/president/president.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: PageComponent },
  { path: 'page/:pageId', component: PageComponent },
  { path: 'page/:pageId/:postTitle', component: BlogpostComponent },
  { path: 'post/:postTitle', component: BlogpostComponent },
  { path: 'birthday', component: BirthdayComponent },
  { path: 'day-in-history', component: DayInHistoryComponent },
  { 
    path: 'celebrity/:celebName', 
    component: CelebrityPageComponent, 
    data: {paramName: 'celebName', resolveFunction: 'getTrueCelebName'}, 
    resolve: {exists: CelebrityExistsResolver}
  },
  {
    path: 'president/:presidentName',
    component: PresidentComponent,
    data: {paramName: 'presidentName', resolveFunction: 'getTruePresidentName'},
    resolve: {exists: CelebrityExistsResolver}
  },
  { path: 'celebrity', component: CelebrityComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BirthdayComponent,
    DayInHistoryComponent,
    CelebrityComponent,
    InfoSidebarComponent,
    FrontFeatureComponent,
    FrontFeatureCardComponent,
    TvEffectComponentComponent,
    FooterComponent,
    PostExcerptComponent,
    MidFeatureComponent,
    PostExcerptContainerComponent,
    PaginationComponent,
    NotFoundComponent,
    CelebCardComponent,
    RibbonComponent,
    BlogpostComponent,
    PageComponent,
    DynamicContentComponent,
    MissedArticleWidgetComponent,
    CelebrityPageComponent,
    PresidentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [CelebrityExistsResolver],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
