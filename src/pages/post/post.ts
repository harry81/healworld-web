import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ItemService } from '../../providers/item-service';
import { AuthService } from '../../providers/auth-service';
import { GeoService } from '../../providers/geo-service';

declare var fooga:Function;

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
    public price: number;
    public user: any;
    public imagespinner: boolean = false;

    mySlideOptions = {
        initialSlide: 1
    };

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public itemService: ItemService,
                public authService: AuthService,
                public geoService: GeoService,
                public alertCtrl: AlertController,
                private formBuilder: FormBuilder) {

        this.postForm = this.formBuilder.group({
            'title': [
                '', Validators.compose([Validators.required])
            ],
            'memo': ['', Validators.compose([Validators.required])],
            'price': [
                '', Validators.compose([Validators.required])
            ],
            'phone': [
                '', Validators.compose([Validators.required])
            ],
            'image_ids': [''],
            'point': [''],
            'grade': ['3'],
            'address': [''],
        });

        this.user = JSON.parse(localStorage.getItem('user'));
    }

    popView(){
        this.navCtrl.pop();
    }

    onPostImage(input) {
        for (var i = 0; i < input.files.length; i++) {
            this.postImage(input.files[i]);
        }
    }

    postImage(file) {
        this.imagespinner = true;

        this.itemService.postImage(file)
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
            }, () => {
                this.imagespinner = false;
            });
    }

    onSubmit() {
        let coord = JSON.parse(sessionStorage.getItem('position'));
        if (coord === null){
            alert("등록하려는 위치를 찾지 못했습니다.");
            return
        }

        this.postForm.value['user_id'] = this.user.pk;
        this.postForm.value['point'] = `POINT (${coord.lng} ${coord.lat} )`;
        this.postForm.value['address'] = this.address;
        this.postForm.value['image_ids'] = this.preview.map(function(a) {return a.id;}).join();
        this.itemService.postItem(this.postForm.value)
            .subscribe(response => {
                this.viewCtrl.dismiss(response);
            }, error => {
                if (error.status == 403){
                    alert("[정보] 로그인 후 진행할 수 있습니다.");
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
                this.position = position;
            },
                  error => alert(error));
    }

    getAddress(){
        this.geoService.getPosition()
            .then((response) => {
                this.geoService.getAddress()
                    .subscribe((response) => {
                        let addr = response['results'][0]['formatted_address'].split(' ');
                        this.address = addr.slice(addr.length - 2, addr.length).join(' ');
                    },error=> {
                        fooga('send', 'event', 'post', error.message);
                        alert('현재 주소를 알수 없습니다.');
                    })
            },error=> {
                fooga('send', 'event', 'post', error.message);
                alert('현재 위치를 알수 없습니다.');
            });
    }

    showPriceradio(evt) {
        let alert = this.alertCtrl.create();
        let postForm = this.postForm;

        alert.setTitle('가격');

        alert.addInput({
            type: 'radio',
            label: '무료드림',
            value: '0',
            checked: true
        });

        for (var i = 1; i < 50; i++) {
            alert.addInput({
                type: 'radio',
                label: eval("i * 1000").toString(),
                value: eval("i * 1000").toString()
            });
        }

        alert.addButton('Cancel');
        alert.addButton({
            text: '확인',
            handler: data => {
                this.price = data;
                postForm.value['price'] = this.price;
            }
        });
        alert.present();
    }
}
