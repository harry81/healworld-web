import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemService } from '../../providers/item-service';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html',
    providers: [ItemService]
})
export class PostPage {

    constructor(public navCtrl: NavController,
                public itemService: ItemService) {}

    ionViewDidLoad() {
        console.log('Hello PostPage Page');
    }

    onPost(input) {
        this.itemService.postImage(input.files[0]);
    }

}
