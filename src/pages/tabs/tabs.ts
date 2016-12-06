import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { PostPage } from '../post/post';
import { DesktopPage } from '../desktop/desktop';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;
  tabHome: any = ListPage;
  tabPostRoot: any = PostPage;
  tabDesktop: any = DesktopPage;
    platform: any;

    constructor(platform: Platform) {
        this.platform = platform;

        if (this.platform.is('core')) {
            this.tabHome = DesktopPage;
        };

    }
}
