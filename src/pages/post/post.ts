import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Post page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-post',
    templateUrl: 'post.html'
})
export class PostPage {

    constructor(public navCtrl: NavController) {}

    ionViewDidLoad() {
        console.log('Hello PostPage Page');
    }

    onPost(input) {
        console.log(input.files);
        console.log(input.files[0]);
    }

}
