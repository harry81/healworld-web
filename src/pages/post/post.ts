import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ItemService } from '../../providers/item-service';
import { AuthService } from '../../providers/auth-service';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html',
    providers: [ItemService, AuthService]
})
export class PostPage {
    public preview: any;
    public address: string;
    public postForm: any;
    public response: any;

    public position: any;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public itemService: ItemService,
                public authService: AuthService,
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
            .subscribe(data => {
                this.response = data; // Property 'itemshot' does not exist on type '{}'

                this.preview = this.response.itemshot.thumbnail__100x100;
                this.postForm.value['image_ids'] = this.response.id;
                this.postForm.value['user_id'] = this.authService.user.pk;
                this.postForm.value['point'] = `POINT (${this.position.coords.longitude} ${this.position.coords.latitude} )`;
                this.postForm.value['address'] = this.address;
            });
    }

    onSubmit() {
        this.itemService.postItem(this.postForm.value)
            .subscribe(response => {
                this.viewCtrl.dismiss();
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
            .subscribe((response) => {
                console.log(response['results'][0]);

                this.address = response['results'][0]['formatted_address'];
            })
    }
}
