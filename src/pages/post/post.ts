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
    public response: any;

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
            'image_ids': [
                ''
            ]
        });
    }

    ionViewDidLoad() {
        console.log('Hello PostPage Page');
    }

    popView(){
        this.navCtrl.pop();
    }

    onPostImage(input) {
        this.itemService.postImage(input.files[0])
            .then(data => {
                console.log('response', data);
                this.response = data; // Property 'itemshot' does not exist on type '{}'

                this.preview = this.response.itemshot.thumbnail__300x200;
                this.postForm.value['image_ids'] = this.response.id;
                this.postForm.value['user'] = 1; // TODO : use real user id
            });
    }

    onSubmit() {
        console.log('submit', this.postForm.value);
        this.itemService.postItem(this.postForm.value);
        this.clearPostForm();
    }

    clearPostForm() {
        this.postForm.reset();

        this.preview = null;
        this.postForm.value['itemshot'] = null;

    }
}
