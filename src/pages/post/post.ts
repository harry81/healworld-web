import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ItemService } from '../../providers/item-service';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html',
    providers: [ItemService]
})
export class PostPage {
    public preview: any;
    public postForm: any;

    constructor(public navCtrl: NavController,
                public itemService: ItemService,
                private formBuilder: FormBuilder) {

        this.postForm = this.formBuilder.group({
            'memo': [
                '', Validators.compose([Validators.required])
            ],
            'price': [
                '3000', Validators.compose([Validators.required])
            ],
            'itemshot': [
                ''
            ]
        });
    }

    ionViewDidLoad() {
        console.log('Hello PostPage Page');
    }

    onPostImage(input) {
        this.itemService.postImage(input.files[0])
            .then(data => {
                console.log('response', data);
                this.preview = data.itemshot.thumbnail__300x200;
                this.postForm.value['itemshot'] = data.id;
                console.log('postForm', this.postForm);
            });
    }

    onSubmit() {
        console.log('submit', this.postForm.value);
        this.itemService.postItem(this.postForm.value);
    }
}
