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
    public preview: Array<any> = [];
    public address: string;
    public postForm: any;
    public response: any;

    public position: any;
    mySlideOptions = {
        initialSlide: 1
    };

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public itemService: ItemService,
                public authService: AuthService,
                private formBuilder: FormBuilder) {

        this.postForm = this.formBuilder.group({
            'title': [
                '', Validators.compose([Validators.required])
            ],
            'memo': [''],
            'price': [
                '5000', Validators.compose([Validators.required])
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
                this.response = data; // because property 'itemshot' does not exist on type '{}'
                this.preview.push(this.response);
                this.postForm.value['image_ids'] = this.response.id;
            });
    }

    onSubmit() {
        this.postForm.value['user_id'] = this.authService.user.pk;
        this.postForm.value['point'] = `POINT (${this.position.coords.longitude} ${this.position.coords.latitude} )`;
        this.postForm.value['address'] = this.address;
        this.postForm.value['image_ids'] = this.preview.map(function(a) {return a.id;}).join();
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
