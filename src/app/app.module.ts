import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailPage } from '../pages/detail/detail';
import { PostPage } from '../pages/post/post';
import { TabsPage } from '../pages/tabs/tabs';
import { DesktopPage } from '../pages/desktop/desktop';
import { MapPage } from '../pages/map/map';


let storage = new Storage();

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        headerPrefix: 'JWT',
        noJwtError: true,
        globalHeaders: [{'Accept': 'application/json'}],
        tokenGetter: (() => storage.get('id_token')),
    }), http);
}

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        ListPage,
        DetailPage,
        PostPage,
        DesktopPage,
        MapPage,
        TabsPage],
    imports: [
        IonicModule.forRoot(MyApp),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDRCEiyDSW4JsDxFe7bJ17w9cpnLljvEQA'
        }),
        MomentModule],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        ListPage,
        DetailPage,
        PostPage,
        DesktopPage,
        MapPage,
        TabsPage
    ],
    providers: [CookieService,
                {
                    provide: AuthHttp,
                    useFactory: getAuthHttp,
                    deps: [Http]
                }
               ]
})
export class AppModule {}
