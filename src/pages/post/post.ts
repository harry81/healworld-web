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
    public address: string;
    public postForm: any;
    public response: any;

    public position: any;

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
            'image_ids': [''],
            'point': [''],
            'address': [''],
        });
    }

    ionViewDidLoad() {
        this.getCurrentLocation();
    }

    popView(){
        this.navCtrl.pop();
    }

    onPostImage(input) {
        this.getAddress()
        this.itemService.postImage(input.files[0])
            .then(data => {
                this.response = data; // Property 'itemshot' does not exist on type '{}'

                this.preview = this.response.itemshot.thumbnail__300x200;
                this.postForm.value['image_ids'] = this.response.id;
                this.postForm.value['user_id'] = 1; // TODO : use real user id
                this.postForm.value['point'] = `POINT (${this.position.coords.longitude} ${this.position.coords.latitude} )`;
                this.postForm.value['address'] = this.address;
            });
    }

    onSubmit() {
        this.itemService.postItem(this.postForm.value)
            .then(response => {
                this.clearPostForm();
                this.navCtrl.pop();
            });
    }

    clearPostForm() {
        this.postForm.reset();
        this.preview = null;
        this.postForm.value['itemshot'] = null;
    }

    getCurrentLocation(){
        this.itemService.getPosition()
            .then(position =>{
                console.log(position);
                this.position = position;
            },
                  error => alert(error));
    }

    getAddress(){
        this.itemService.getAddress(this.position.coords.latitude,
                                    this.position.coords.longitude)
            .then((response) => {
                console.log(response['results'][0]);

                this.address = response['results'][0]['formatted_address'];
            })
    }
}
