import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ItemService } from '../../providers/item-service';
import { AuthService } from '../../providers/auth-service';
import { MapPage } from '../map/map';


@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html',
    providers: [ItemService, AuthService],
})

export class DetailPage {
    public lat: number;
    public lng: number;
    public zoom: number;
    public item: any;
    public comments: any;
    public postForm: any;

    constructor(public navCtrl: NavController,
                public params:NavParams,
                private formBuilder: FormBuilder,
                public authService: AuthService,
                public itemService: ItemService) {

        this.item = params.get("item");
        this.postForm = this.formBuilder.group({
            'comment': ['', Validators.compose([Validators.required])]
        });
    }

    ionViewDidLoad() {
        this.loadItem(this.item);
        this.loadComment();
    }

    loadItem(item) {
        this.itemService.loadItem(item.properties.pk)
            .subscribe(data => {
                this.lat = data['geometry']['coordinates'][1];
                this.lng = data['geometry']['coordinates'][0];
                this.zoom = 14;
            });
    }

    loadComment() {
        let params: URLSearchParams = new URLSearchParams();
        params.set('object_pk', this.item.properties.pk);

        this.itemService.loadComment(params)
            .subscribe(res => {
                this.comments = res;
            });
    }

    postComment() {
        this.postForm.value['content_type'] = 8; // content type of Item
        this.postForm.value['site'] = 1;
        this.postForm.value['user_name'] = this.authService.user.username;
        this.postForm.value['user'] = this.authService.user.pk;
        this.postForm.value['object_pk'] = this.item.properties.pk;

        this.itemService.postComment(this.postForm.value)
            .subscribe(response => {
                this.postForm.value['submit_date'] = Date.now();
                this.comments.unshift(this.postForm.value);
                this.postForm.reset();
            },
                       error => {
                           console.log(error);
                           alert("[정보] 로그인후 댓글을 달 수 있습니다.");
                       });
    }

    showMap() {
        this.navCtrl.push(MapPage, {
            lat: this.lat,
            lng: this.lng,
            zoom: this.zoom
        });
    }
}
