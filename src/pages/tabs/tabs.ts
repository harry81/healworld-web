import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { PostPage } from '../post/post';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;
  tab4Root: any = ListPage;
  tabPostRoot: any = PostPage;

    constructor(public modalCtrl: ModalController) {

    }

    presentAddModal(){
        let profileModal = this.modalCtrl.create(PostPage);
        profileModal.present();
    }
}
