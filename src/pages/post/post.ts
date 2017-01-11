import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ItemService } from '../../providers/item-service';
import { AuthService } from '../../providers/auth-service';
import { GeoService } from '../../providers/geo-service';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html',
    providers: [ItemService, AuthService, GeoService]
})
export class PostPage {
    public preview: Array<any> = [];
    public postForm: any;
    public response: any;
    public address: string;
    public position: any;
    public user: any;

    mySlideOptions = {
        initialSlide: 1
    };

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public itemService: ItemService,
                public authService: AuthService,
                public geoService: GeoService,
                private formBuilder: FormBuilder) {

        this.postForm = this.formBuilder.group({
            'title': [
                '', Validators.compose([Validators.required])
            ],
            'memo': ['', Validators.compose([Validators.required])],
            'price': [
                '', Validators.compose([Validators.required])
            ],
            'image_ids': [''],
            'point': [''],
            'quality': [''],
            'address': [''],
        });

        this.user = JSON.parse(localStorage.getItem('user'));

    }

    ionViewDidLoad() {
        this.getCurrentLocation();
    }

    popView(){
        this.navCtrl.pop();
    }

    onPostImage(input) {
        this.itemService.postImage(input.files[0])
            .subscribe(data => {
                this.response = data; // because property 'itemshot' does not exist on type '{}'
                this.preview.push(this.response);
                this.postForm.value['image_ids'] = this.response.id;
            }, error => {
                if (error.status == 403){
                    alert("[정보] 로그인후 사진을 업로드 할 수 있습니다.")
                }
                else {
                    alert("[정보] 사진 업로드에 문제가 있습니다.");
                }
            });
        this.getAddress();
    }

    onSubmit() {
        this.postForm.value['user_id'] = this.user.pk;
        this.postForm.value['point'] = `POINT (${this.position.coords.longitude} ${this.position.coords.latitude} )`;
        this.postForm.value['address'] = this.address;
        this.postForm.value['image_ids'] = this.preview.map(function(a) {return a.id;}).join();
        this.itemService.postItem(this.postForm.value)
            .subscribe(response => {
                this.viewCtrl.dismiss(response);
            }, error => {
                if (error.status == 403){
                    alert("[정보] 로그인후 사진을 업로드 할 수 있습니다.")
                }
                else {
                    alert("[정보] 아이템 등록에 문제가 있습니다.");
                }
            });
    }

    onCancel() {
        this.viewCtrl.dismiss();
    }

    clearPostForm() {
        this.postForm.reset();
        this.preview = null;
        this.postForm.value['itemshot'] = null;
    }

    getCurrentLocation(){
        this.geoService.getPosition()
            .then(position =>{
                console.log(position);
                this.position = position;
            },
                  error => alert(error));
    }

    getAddress(){
        this.geoService.getAddress()
            .subscribe((response) => {
                console.log(response['results'][0]);

                this.address = response['results'][0]['formatted_address'];
            },error=> {
                console.log('hi');
            })
    }
}
