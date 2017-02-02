import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig } from 'ionic-angular';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import 'moment/locale/ko';
import * as Raven from 'raven-js';
import { Http } from '@angular/http';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailPage } from '../pages/detail/detail';
import { MyitemPage } from '../pages/myitem/myitem';
import { SignupPage } from '../pages/signup/signup';
import { SearchPage } from '../pages/search/search';
import { PostPage } from '../pages/post/post';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { DesktopPage } from '../pages/desktop/desktop';
import { MapPage } from '../pages/map/map';


Raven
  .config('https://685b68704634462ebd2b855d94f39bf6@sentry.io/127326')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err.originalError);
  }
}

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        headerPrefix: 'JWT',
        noJwtError: true,
        globalHeaders: [{'Accept': 'application/json'}],
        tokenGetter: (() => localStorage.getItem('id_token'))
    }), http);
}

export const deepLinkConfig: DeepLinkConfig = {
    links: [
        { component: ProfilePage, name: 'Profile', segment: 'profile' },
        { component: MyitemPage, name: 'Myitem', segment: 'myitem' },
        { component: SignupPage, name: 'Signup', segment: 'signup' },
        { component: DetailPage,
          name: 'Detail', segment: 'detail/:item',
          defaultHistory: [ListPage] }
    ]
};

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        ListPage,
        DetailPage,
        MyitemPage,
        SignupPage,
        SearchPage,
        PostPage,
        ProfilePage,
        DesktopPage,
        MapPage,
        TabsPage],
    imports: [
        IonicModule.forRoot(MyApp, {}, deepLinkConfig),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDRCEiyDSW4JsDxFe7bJ17w9cpnLljvEQA'
        }),
        MomentModule],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        ListPage,
        DetailPage,
        MyitemPage,
        SignupPage,
        SearchPage,
        PostPage,
        ProfilePage,
        DesktopPage,
        MapPage,
        TabsPage
    ],
    providers: [CookieService,
                {
                    provide: AuthHttp,
                    useFactory: getAuthHttp,
                    deps: [Http]
                },
                { provide: LOCALE_ID, useValue: "ko" },
                { provide: ErrorHandler, useClass: RavenErrorHandler }
               ]
})
export class AppModule {}
