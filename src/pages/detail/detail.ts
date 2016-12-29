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
    public comments: any[];
    public postForm: any;
    public placeholder_comment: string = "댓글 달기";

    constructor(public navCtrl: NavController,
                public params:NavParams,
                private formBuilder: FormBuilder,
                public authService: AuthService,
                public itemService: ItemService) {

        this.item = params.get("item");
        this.postForm = this.formBuilder.group({
            'comment': ['', Validators.compose([Validators.required])]
        });

        if (!this.authService.isAuthorized()) {
            this.placeholder_comment = "로그인후 댓글을 달 수 있습니다";
        }
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
        if (!this.authService.isAuthorized()) {
            alert("[정보] 로그인후 댓글을 달 수 있습니다.");
            return;
        }

        this.postForm.value['content_type'] = 8; // content type of Item
        this.postForm.value['site'] = 1;
        this.postForm.value['user_name'] = this.authService.user.username;
        this.postForm.value['user'] = this.authService.user.pk;
        this.postForm.value['object_pk'] = this.item.properties.pk;

        this.itemService.postComment(this.postForm.value)
            .subscribe(response => {
                this.comments.unshift(response);
                this.postForm.reset();
            },
                       error => {
                if (error.status == 403){
                    alert("[정보] 로그인후 사진을 업로드 할 수 있습니다.")
                }
                else {
                    alert("[정보] 사진 업로드에 문제가 있습니다.");
                }
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
